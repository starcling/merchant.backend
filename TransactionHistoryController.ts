import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { JsonController, Get, Res, Param, Post, Body } from 'routing-controllers';
import {DataService, ISqlQuery} from '../../utils/datasource/DataService';

@JsonController('/transactionHistory')
export class TransactionHistoryController {
    @Get('/all')
    public async merchantAddress(@Body() request: any, @Res() response: any): Promise<any> {
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
           return new APIResponseHandler().handle(response, queryResult);
        } catch (err) {
            return new APIResponseHandler().handle(response, { status: 400, error: err });
        }
    }

}