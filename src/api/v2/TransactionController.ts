import {JsonController, Res, Post, Body, Get, Param, QueryParam, UseBefore} from 'routing-controllers';
import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { TransactionConnector } from '../../connectors/api/v1/TransactionConnector';
import { CreateTransactionValidator } from '../../validators/TransactionValidator/CreateTransactionValidator';
import { ITransactionInsert, ITransactionGet } from '../../core/transaction/models';
import { GetTransactionValidator } from '../../validators/TransactionValidator/GetTransactionValidator';
import {ApiAuthenticationMiddleware} from '../../middleware/ApiAuthenticationMilddleware';

@JsonController('/transactions')
export class TransactionController {

    /**
    * @apiDefine Response
    * @apiSuccess {boolean} success The HTTP success of the call
    * @apiSuccess {number} status The HTTP status of the call
    * @apiSuccess {string} message A human-friendly summary of the result of the call
    * @apiSuccess {object} data The response data of the call
    *
    */

    /**
    * @api {post} /api/v2/transactions/
    * @apiDescription Create a new transaction in DB
    *
    * @apiName createTransaction
    * @apiGroup TransactionController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} hash - The hash of the transaction
    * @apiParam {string} paymentID - The payment id
    * @apiParam {number} typeID - The type id of the transaction. 1 for register,2 for initial,3 for execute and 4 for cancel
    * @apiParam {string} timestamp - The timestamp of the transaction
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "hash": "0xn9jaj46edm5oplfq6m8ta96221553588139c14ios01gqp5jcpqms3eo8m1r4mtl",
    *   "paymentID": "82150f2c-c325-11e8-b3bc-2b0173837727",
    *   "typeID": 2,
    *   "timestamp": 15381442010077
    * }
    *
    * @apiSuccess (200) {object} transaction Details
    *
    */
    @Post('/')
    @UseBefore(ApiAuthenticationMiddleware)
    public async createTransaction(@Body() transaction: ITransactionInsert, @Res() response: any): Promise<any> {
        try {
            new CreateTransactionValidator().validate(transaction);
            const result = await new TransactionConnector().createTransaction(transaction);

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
    * @api {get} /api/v2/transactions/:transactionHash
    * @apiDescription Retrieves a single transaction
    *
    * @apiName getTransaction
    * @apiGroup TransactionController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} transactionHash - ID of the transaction
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "transactionHash": "24947f2e-9164-11e8-bc8e-27e75bf6baf4"
    * }
    *
    * @apiSuccess (200) {object} transaction details for a specific id
    *
    */
    @Get('/:transactionHash')
    public async getTransaction(@Param('transactionHash') transactionHash: string, @Res() response: any): Promise<any> {
        try {
            new GetTransactionValidator().validate({ transactionHash });
            const result = await new TransactionConnector().getTransaction(<ITransactionGet>{ hash: transactionHash });

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
     * @api {get} /api/v2/transactions/pull-payments/paymentID
     * @apiDescription Retrieve an array of transactions
     *
     * @apiName getTransactionsByContractID
     * @apiGroup TransactionController
     * @apiVersion  1.0.0
     *
     * @apiSuccess (200) {object} transaction Details
     *
     */
    @Get('/pull-payment/:pullPaymentID/')
    public async getTransactionsByPaymentID(
        @Param('pullPaymentID') pullPaymentID: string,
        @QueryParam('statusID') statusID: number,
        @QueryParam('typeID') typeID: number,
        @Res() response: any): Promise<any> {
        try {

            new GetTransactionValidator().validate({ pullPaymentID, statusID, typeID });
            const result = await new TransactionConnector()
                .getTransactionsByPaymentID(<ITransactionGet>{ paymentID: pullPaymentID, statusID, typeID });

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }
}