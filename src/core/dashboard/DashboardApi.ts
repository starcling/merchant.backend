import { CreatePaymentModelHandler } from '../../core/paymentModel/CreatePaymentModelHandler';
import { SmartContractReader } from '../../utils/blockchain/SmartContractReader';
import { DashboardDbConnector } from '../../connectors/dbConnector/DashboardDbConnector';
import { MerchantSDK } from '../../core/MerchantSDK';
import { DashboardResponseHandler } from '../../utils/DashboardResponseHandler/DashboardResponseHandler';
import { DefaultConfig } from '../../config/default.config';
import { Globals } from '../../utils/globals';

const ether = require('node-etherscan-api');
const cc = require('cryptocompare');
const WEB3 = require('web3');
declare const global;
global.fetch = require('node-fetch');
const networkID = DefaultConfig.settings.networkID;

export class DashboardApi {
    public async getMerchantAddress() {
        try {
            const result = (await new CreatePaymentModelHandler().getBankAddress()).bankAddress.toLowerCase();
            return new DashboardResponseHandler().handleSuccess('Successfully retrived', result);
        } catch (err) {
            return new DashboardResponseHandler().handleFailed('Failed to retrive', err);
        }
    }

    public async balance() {
        try {
            const address = (await new CreatePaymentModelHandler().getBankAddress()).bankAddress;
            const web3 = await new WEB3(new WEB3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(networkID)));
            const bal = await web3.eth.getBalance(address);
            const result = await web3.utils.fromWei(bal, 'ether');
            return new DashboardResponseHandler().handleSuccess('Successfully retrived', result);
        } catch (err) {
            return new DashboardResponseHandler().handleFailed('Failed to retrive', err);
        }
    }

    public async pmaBalance() {
        try {
            const address = (await new CreatePaymentModelHandler().getBankAddress()).bankAddress;
            const tokenAddress = Globals.GET_TOKEN_ADDRESS();
            const contract = await new SmartContractReader(Globals.GET_PULL_PAY_CONTRACT_NAME(), networkID).readContract(tokenAddress);
            const balance = await contract.methods.balanceOf(address).call({ from: address });
            const web3 = await new WEB3(new WEB3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(networkID)));
            const result = await web3.utils.fromWei(balance, 'ether');
            return new DashboardResponseHandler().handleSuccess('Successfully retrived', result);
        } catch (err) {
            return new DashboardResponseHandler().handleFailed('Failed to retrive', err);
        }
    }

    public async getGas() {
        try {
            const etherscan = new ether(Globals.GET_TOKENAPI_KEY());
            const bal = await etherscan.getGasPrice();
            const web3 = await new WEB3(new WEB3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(networkID)));
            const result = await web3.utils.fromWei(bal, 'ether');
            return new DashboardResponseHandler().handleSuccess('Successfully retrived', result);
        } catch (err) {
            return new DashboardResponseHandler().handleFailed('Failed to retrive', err);
        }
    }

    public async getTransact() {
        try {
            const queryResult = await new DashboardDbConnector().getAllTransact();
            const data = queryResult.data;
            const result = [];
            const promises = data.map(async (value, index) => {
                const web3 = await new WEB3(new WEB3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(networkID)));
                const val = await web3.eth.getTransaction(value.hash);
                val.billingName = value.title;
                result.push(val);
            });
            await Promise.all(promises);
            return new DashboardResponseHandler().handleSuccess('Successfully retrived', result);
        } catch (err) {
            return new DashboardResponseHandler().handleFailed('Failed to retrive', err);
        }
    }
    public async getUsdBalance() {
        try {
            cc.setApiKey(Globals.GET_CRYPTOCOMPARE_KEY());
            const result = await cc.price('PMA', ['USD', 'EUR']);
            return new DashboardResponseHandler().handleSuccess('Successfully retrived', result);
        } catch (err) {
            return new DashboardResponseHandler().handleFailed('Failed to retrive', err);
        }
    }

    public async getUsdBalanceeth() {
        try {
            cc.setApiKey(Globals.GET_CRYPTOCOMPARE_KEY());
            const result = await cc.price('ETH', ['USD', 'EUR']);
            return new DashboardResponseHandler().handleSuccess('Successfully retrived', result);
        } catch (err) {
            return new DashboardResponseHandler().handleFailed('Failed to retrive', err);
        }
    }

    public async getPullPaymentGas() {
        try {
            const sdk = MerchantSDK.GET_SDK();
            const result = await sdk.calculateMaxExecutionFee();
            return new DashboardResponseHandler().handleSuccess('Successfully retrived', result);
        } catch (err) {
            return new DashboardResponseHandler().handleFailed('Failed to retrive', err);
        }
    }

    public async getTransferGas() {
        try {
            const address = (await new CreatePaymentModelHandler().getBankAddress()).bankAddress.toLowerCase();
            const sdk = MerchantSDK.GET_SDK();
            const result = await sdk.calculateTransferFee('0x', address, Globals.GET_ETHER_VALUE());
            return new DashboardResponseHandler().handleSuccess('Successfully retrived', result);
        } catch (err) {
            return new DashboardResponseHandler().handleFailed('Failed to retrive', err);
        }
    }

    public async testhashOverView(billmodelId: any) {
        try {
            const queryResult = await new DashboardDbConnector().getAllTransactionOverView(billmodelId);
            const data = queryResult.data;
            const result = [];
            const promises = data.map(async (value, index) => {
                const web3 = await new WEB3(new WEB3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(networkID)));
                const val = await web3.eth.getTransaction(value.hash);
                val.typeID = value.typeID;
                val.id = value.id;
                result.push(val);
            });
            await Promise.all(promises);
            return new DashboardResponseHandler().handleSuccess('Successfully retrived', result);
        } catch (err) {
            return new DashboardResponseHandler().handleFailed('Failed to retrive', err);
        }
    }
}
