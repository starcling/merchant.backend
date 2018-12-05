import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { JsonController, Get, Res, Body } from 'routing-controllers';
import { Globals } from '../../utils/globals';
import { CreatePaymentModelHandler } from '../../core/paymentModel/CreatePaymentModelHandler';
import { DataService, ISqlQuery } from '../../utils/datasource/DataService';
import { SmartContractReader } from '../../utils/blockchain/SmartContractReader';
const WEB3 = require('web3');
let data;

@JsonController('/Dashboard')
export class DashboardController {

    @Get('/transact')
    public async merchantAddress(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            const sqlQuery: ISqlQuery = {
                text: `select distinct tb_payments."merchantAddress" from public.tb_payments;`
            };
            const queryResult = await new DataService().executeQueryAsPromise(sqlQuery, false);
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
            return new APIResponseHandler().handle(response, { status: 400, error: err });
        }
    }

    @Get('/pmabalance')
    public async pmaBalance(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            const address = (await new CreatePaymentModelHandler().getBankAddress()).bankAddress;
            const tokenAddress = Globals.GET_TOKEN_ADDRESS();
            const contract = await new SmartContractReader(Globals.GET_PULL_PAYMENT_CONTRACT_NAME(), 3).readContract(tokenAddress);
            const balance = await contract.methods.balanceOf(address).call({ from: address });
            const web3 = await new WEB3(new WEB3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(3)));
            const result = await web3.utils.fromWei(balance, 'ether');
            return new APIResponseHandler().handle(response, { status: 200, result });
        } catch (err) {
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
            return new APIResponseHandler().handle(response, { status: 400, error: err });
        }
    }

}
