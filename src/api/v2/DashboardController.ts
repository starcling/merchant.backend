import { JsonController, Get, Post, Res, Body } from 'routing-controllers';
import { Globals } from '../../utils/globals';
import { CreatePaymentModelHandler } from '../../core/paymentModel/CreatePaymentModelHandler';
import { SmartContractReader } from '../../utils/blockchain/SmartContractReader';
import { HTTPResponseCodes } from '../../utils/web/HTTPResponseCodes';
import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { DashboardDbConnector } from '../../connectors/dbConnector/DashboardDbConnector';
import { MerchantSDK } from '../../core/MerchantSDK';
const ether = require('node-etherscan-api');
const cc = require('cryptocompare');
const WEB3 = require('web3');
declare const global;
global.fetch = require('node-fetch');

@JsonController('/Dashboard')
export class DashboardController {

    /**
     * @api {get} /api/v2/Dashboard/transact
     * @apiDescription Retrieve the merchant address
     *
     * @apiName merchantAddress
     * @apiGroup DashboardController
     * @apiVersion  1.0.0
     *
     * @apiSuccess (200) {object} All Payments Details
     *
     */
    @Get('/transact')
    public async merchantAddress(): Promise<any> {
        try {
            const queryResult = await new DashboardDbConnector().getMerchantAddress();
            return new HTTPResponseHandler().handleSuccess('Merchant address retrieve successfully', queryResult, HTTPResponseCodes.OK());
        } catch (err) {
            return new HTTPResponseHandler().handleFailed('Failed to retrieve address', err, 400);
        }
    }

    /**
     * @api {get} /api/v2/Dashboard/address
     * @apiDescription Retrieve the bank address
     *
     * @apiName mkeyAddress
     * @apiGroup DashboardController
     * @apiVersion  1.0.0
     *
     * @apiSuccess (200) {object} All Payments Details
     *
     */
    @Get('/address')
    public async mkeyAddress(): Promise<any> {
        try {
            const address = (await new CreatePaymentModelHandler().getBankAddress()).bankAddress.toLowerCase();
            return new HTTPResponseHandler().handleSuccess('Bank address retrieve successfully', address, HTTPResponseCodes.OK());
        } catch (err) {
            return new HTTPResponseHandler().handleFailed('Failed to retrieve address', err, 400);
        }
    }

    /**
     * @api {get} /api/v2/Dashboard/etherBalance
     * @apiDescription Retrieve the balance for bank address
     *
     * @apiName balance
     * @apiGroup DashboardController
     * @apiVersion  1.0.0
     *
     * @apiSuccess (200) {object} All Payments Details
     *
     */
    @Get('/etherBalance')
    public async balance(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            const address = (await new CreatePaymentModelHandler().getBankAddress()).bankAddress;
            const web3 = await new WEB3(new WEB3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(3)));
            const bal = await web3.eth.getBalance(address);
            const result = await web3.utils.fromWei(bal, 'ether');
            return new HTTPResponseHandler().handleSuccess('Balance retrieve successfully', result, HTTPResponseCodes.OK());
        } catch (err) {
            return new HTTPResponseHandler().handleFailed('Failed to retrieve address', err, 400);
        }
    }
    /**
      * @api {get} /api/v2/Dashboard/pmabalance
      * @apiDescription Retrieve a treasury balance
      *
      * @apiName pmaBalance
      * @apiGroup DashboardController
      * @apiVersion  1.0.0
      *
      * @apiSuccess (200) {object} All Payments Details
      *
      */
    @Get('/pmabalance')
    public async pmaBalance(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            const address = (await new CreatePaymentModelHandler().getBankAddress()).bankAddress;
            const tokenAddress = Globals.GET_TOKEN_ADDRESS();
            const contract = await new SmartContractReader(Globals.GET_PULL_PAY_CONTRACT_NAME(), 3).readContract(tokenAddress);
            const balance = await contract.methods.balanceOf(address).call({ from: address });
            const web3 = await new WEB3(new WEB3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(3)));
            const result = await web3.utils.fromWei(balance, 'ether');
            return new HTTPResponseHandler().handleSuccess('Balance retrieve successfully', result, HTTPResponseCodes.OK());
        } catch (err) {
            return new HTTPResponseHandler().handleFailed('Failed to retrieve balance', err, 400);
        }
    }
    /**
      * @api {get} /api/v2/Dashboard/gas
      * @apiDescription Retrieve a gas value in ether
      *
      * @apiName getGas
      * @apiGroup DashboardController
      * @apiVersion  1.0.0
      *
      * @apiSuccess (200) {object} All Payments Details
      *
      */
    @Get('/gas')
    public async getGas(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            const etherscan = new ether(Globals.GET_TOKENAPI_KEY());
            const bal = await etherscan.getGasPrice();
            const web3 = await new WEB3(new WEB3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(3)));
            const result = await web3.utils.fromWei(bal, 'ether');
            return new HTTPResponseHandler().handleSuccess('Gas retrieve successfully', result, HTTPResponseCodes.OK());
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed to retrieve address', error, 400);
        }
    }

    /**
      * @api {get} /api/v2/Dashboard/hash
      * @apiDescription Retrieve transaction history using Hash & BlockNumber
      *
      * @apiName testhash
      * @apiGroup DashboardController
      * @apiVersion  1.0.0
      *
      * @apiSuccess (200) {object} All Payments Details
      *
      */
    @Get('/hash')
    public async testhash(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            const queryResult = await new DashboardDbConnector().getAllTransact();
            const data = queryResult.data;
            const result = [];
            const promises = data.map(async (value, index) => {
                const web3 = await new WEB3(new WEB3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(3)));
                const val = await web3.eth.getTransaction(value.hash);
                val.billingName = value.title;
                result.push(val);
            });
            await Promise.all(promises);
            return new HTTPResponseHandler().handleSuccess('Retrieve successfully', result, HTTPResponseCodes.OK());
        } catch (err) {
            console.log('Error', err);
            return new HTTPResponseHandler().handleFailed('Failed to retrieve balance', err, 400);
        }
    }

    /**
      * @api {get} /api/v2/Dashboard/USDvalue
      * @apiDescription Retrieve ether value in USD & EUR
      *
      * @apiName getUsdBalance
      * @apiGroup DashboardController
      * @apiVersion  1.0.0
      *
      * @apiSuccess (200) {object} All Payments Details
      *
      */
    @Get('/USDvalue')
    public async getUsdBalance(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            cc.setApiKey(Globals.GET_CRYPTOCOMPARE_KEY());
            const result = await cc.price('ETH', ['USD', 'EUR']);
            return new HTTPResponseHandler().handleSuccess('Balance retrieve successfully', result, HTTPResponseCodes.OK());
        } catch (err) {
            return new HTTPResponseHandler().handleFailed('Failed to retrieve balance', err, 400);
        }
    }

    /**
     * @api {get} /api/v2/Dashboard/pullPaymentGas
     * @apiDescription Retrieve ether value in USD & EUR
     *
     * @apiName getUsdBalance
     * @apiGroup DashboardController
     * @apiVersion  1.0.0
     *
     * @apiSuccess (200) {object} All Payments Details
     *
     */
    @Get('/pullPaymentGas')
    public async getPullPaymentGas(@Res() response: any): Promise<any> {
        try {
            const sdk = MerchantSDK.GET_SDK();
            const result = await sdk.calculateMaxExecutionFee();
            return new HTTPResponseHandler().handleSuccess('Pull Payment gas fee retrieve successfully.', result, HTTPResponseCodes.OK());
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed to retrieve address', error, 400);
        }
    }
    /**
     * @api {get} /api/v2/Dashboard/transferGas
     * @apiDescription Retrieve a gas value for tranfer from pullpayment account to treasury
     *
     * @apiName getTransferGas
     * @apiGroup DashboardController
     * @apiVersion  1.0.0
     *
     * @apiSuccess (200) {object} All Payments Details
     *
     */

    @Get('/transferGas')
    public async getTransferGas(@Res() response: any): Promise<any> {
        try {
            const address = (await new CreatePaymentModelHandler().getBankAddress()).bankAddress.toLowerCase();
            const sdk = MerchantSDK.GET_SDK();
            const result = await sdk.calculateTransferFee('0x', address, 100000000000);
            return new HTTPResponseHandler().handleSuccess('PMA Transfer gas retrieve successfully.', result, HTTPResponseCodes.OK());
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed to retrieve address', error, 400);
        }
    }

    /**
     * @api {get} /api/v2/Dashboard/hashOverView
     * @apiDescription Retrieve transaction history for billing model overview
     *
     * @apiName testhashOverView
     * @apiGroup DashboardController
     * @apiVersion  1.0.0
     *
     * @apiSuccess (200) {object} All Payments Details
     *
     */
    @Post('/hashOverView')
    public async testhashOverView(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            const queryResult = await new DashboardDbConnector().getAllTransactionOverView(request.billmodelId);
            const data = queryResult.data;
            const result = [];
            const promises = data.map(async (value, index) => {
                const web3 = await new WEB3(new WEB3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(3)));
                const val = await web3.eth.getTransaction(value.hash);
                val.typeID = value.typeID;
                val.id = value.id;
                result.push(val);
            });
            await Promise.all(promises);
            return new HTTPResponseHandler().handleSuccess('Retrieve successfully', result, HTTPResponseCodes.OK());
        } catch (err) {
            return new HTTPResponseHandler().handleFailed('Failed to retrieve balance', err, 400);
        }
    }
}
