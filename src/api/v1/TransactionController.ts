import { JsonController, Res, Post, Body, Get, Param, QueryParam } from 'routing-controllers';
import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { TransactionConnector } from '../../connectors/api/v1/TransactionConnector';
import { CreateTransactionValidator } from '../../validators/TransactionValidator/CreateTransactionValidator';
import { ITransactionInsert, ITransactionGet } from '../../core/transaction/models';
import { GetTransactionValidator } from '../../validators/TransactionValidator/GetTransactionValidator';

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
    * @api {post} /api/v1/transactions/
    * @apiDescription Create a new transaction in DB
    *
    * @apiName createTransaction
    * @apiGroup TransactionController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} title - Title of the transaction
    * @apiParam {string} description - Description of the transaction
    * @apiParam {number} amount - Amount of transaction
    * @apiParam {string} currency - Currency of transaction
    * @apiParam {number} startTimestamp - Start timestamp of transaction
    * @apiParam {number} endTimestamp - End timestamp of transaction
    * @apiParam {number} type - Type of transaction
    * @apiParam {string} merchantAddress - Ethereum wallet address of merchant
    * @apiParam {number} frequency - Frequency of execution
    * @apiParam {number} networkID - ETH Network ID - 1 mainnet / 3 ropsten
    *
    * @apiParamExample {json} Request-Example:
    * {
    * }
    *
    * @apiSuccess (200) {object} transaction Details
    *
    */
    @Post('/')
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
    * @api {get} /api/v1/transactions/:transactionHash
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
     * @api {get} /api/v1/transactions/pull-payments/paymentID
     * @apiDescription Retrieve an array of transactions
     *
     * @apiName getTransactionsByContractID
     * @apiGroup TransactionController
     * @apiVersion  1.0.0
     *
     *
     * @apiSuccess (200) {object} transaction Details
     *
     */
    @Get('/payment/:paymentID/')
    public async getTransactionsByPaymentID(
        @Param('paymentID') paymentID: string,
        @QueryParam('statusID') statusID: number,
        @QueryParam('typeID') typeID: number,
        @Res() response: any): Promise<any> {
        try {

            new GetTransactionValidator().validate({ paymentID, statusID, typeID });
            const result = await new TransactionConnector()
                .getTransactionsByPaymentID(<ITransactionGet>{ paymentID: paymentID, statusID, typeID });

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }
}