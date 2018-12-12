import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { JsonController, Get, Res, Body } from 'routing-controllers';
import { Globals } from '../../utils/globals';
import { CreatePaymentModelHandler } from '../../core/paymentModel/CreatePaymentModelHandler';
import { DataService, ISqlQuery } from '../../utils/datasource/DataService';
import { SmartContractReader } from '../../utils/blockchain/SmartContractReader';
import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { HTTPResponseCodes } from '../../utils/web/HTTPResponseCodes';
const WEB3 = require('web3');
let data;
const ether = require('node-etherscan-api');
const TOKEN_API = 'UTW1IZ3TIFXEFCK8R6GW9FNGBNXYQ8HVYN';

const globalAny: any = global;
globalAny.fetch = require('node-fetch');
const cc = require('cryptocompare');

@JsonController('/Dashboard')
export class DashboardController {
    @Get('/transact')
    public async merchantAddress(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            const sqlQuery: ISqlQuery = {
                text: `select distinct tb_payments."merchantAddress" from public.tb_payments;`
            };

            //values: [this.email]
            const queryResult = await new DataService().executeQueryAsPromise(sqlQuery, false);
            // console.log('data', queryResult.data.hdWalletIndex);
            return new APIResponseHandler().handle(response, { status: 200, queryResult });
        } catch (err) {
            console.debug(err);
            return new APIResponseHandler().handle(response, { status: 400, error: err });
        }
    }

    @Get('/address')
    public async mkeyAddress(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            const address = (await new CreatePaymentModelHandler().getBankAddress()).bankAddress.toLowerCase();
            return new APIResponseHandler().handle(response, { status: 200, address });
        } catch (err) {
            console.log('err-->', err);
            return new APIResponseHandler().handle(response, { status: 400, error: err });
        }
    }

    @Get('/pmabalance')
    public async pmaBalance(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            const address = (await new CreatePaymentModelHandler().getBankAddress()).bankAddress;
            const tokenAddress = Globals.GET_TOKEN_ADDRESS();
            const contract = await new SmartContractReader(Globals.GET_PULL_PAYMENT_CONTRACT_NAME(), 3).readContract(tokenAddress);
            //console.log('contract-->', contract);
            const balance = await contract.methods.balanceOf(address).call({ from: address });
            const web3 = await new WEB3(new WEB3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(3)));
            const result = await web3.utils.fromWei(balance, 'ether');
            return new APIResponseHandler().handle(response, { status: 200, result });
        } catch (err) {
            console.log('err-->', err);
            return new APIResponseHandler().handle(response, { status: 400, error: err });
        }
    }

    @Get('/etherBalance')
    public async balance(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            const address = (await new CreatePaymentModelHandler().getBankAddress()).bankAddress;
            const web3 = await new WEB3(new WEB3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(3)));
            const bal = await web3.eth.getBalance(address);
            const result = await web3.utils.fromWei(bal, 'ether');
            return new APIResponseHandler().handle(response, { status: 200, balance: result });
        } catch (err) {
            console.log('err-->', err);
            return new APIResponseHandler().handle(response, { status: 400, error: err });
        }
    }

    @Get('/getAll')
    public async allBalance(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            const sqlQuery: ISqlQuery = {
                text: `SELECT
                tb_payments."pullPaymentModelID",
                tb_payments."lastPaymentDate",
                tb_payments."customerAddress",
                tb_payments."merchantAddress",
                tb_payments."pullPaymentAddress",
                tb_blockchain_transactions."statusID",
                tb_blockchain_transactions.hash,
                tb_blockchain_transactions."paymentID"
              FROM
                public.tb_payments,
                public.tb_blockchain_transactions
              WHERE
                tb_payments."id" = tb_blockchain_transactions."paymentID";`
            };

            const queryResult = await new DataService().executeQueryAsPromise(sqlQuery, false);
            data = queryResult.data;
            const web3 = await new WEB3(new WEB3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(3)));
            const promises = data.map(async (value, index) => {
                const bal = await web3.eth.getBalance(value.pullPaymentAddress);
                const result = await web3.utils.fromWei(bal, 'ether');
                data[index].balance = result;
            });
            await Promise.all(promises);
            return new APIResponseHandler().handle(response, queryResult);

        } catch (err) {
            console.log('err-->', err);
            return new APIResponseHandler().handle(response, { status: 400, error: err });
        }
    }

    @Get('/gas')
    public async getGas(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            const etherscan = new ether(TOKEN_API);
            const bal = await etherscan.getGasPrice();
            const web3 = await new WEB3(new WEB3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(3)));
            const result = await web3.utils.fromWei(bal, 'ether');
            //console.log('Result-->', result);
            const res = {
                message: 'Success',
                gasprice: result
            };
            return new APIResponseHandler().handle(response, { status: 200, res });
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    @Get('/usdvalue')
    public async getUsdBalance(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            cc.setApiKey(Globals.GET_CRYPTOCOMPARE_KEY());
            const result = await cc.price('ETH', ['USD', 'EUR']);
            return new HTTPResponseHandler().handleSuccess('Balance retrieve successfully', result, HTTPResponseCodes.OK());
        } catch (err) {
            return new HTTPResponseHandler().handleFailed('Failed to retrieve balance', err, 400);
        }
    }

    @Get('/gasused')
    public async getGasUsed(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            const web3 = await new WEB3(new WEB3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(3)));
            const result = await web3.eth.estimateGas({
                to: Globals.GET_GAS_ESTIMATE_TO(),
                data: Globals.GET_GAS_ESTIMATE_DATA()
            });
            //console.log('gasused', result);
            const message = 'Gas retrieve successfully';
            return new HTTPResponseHandler().handleSuccess(message, result, HTTPResponseCodes.OK());

        } catch (error) {
            const message = 'Failed to retrieve address';
            return new HTTPResponseHandler().handleFailed(message, error, 400);

        }
    }

}