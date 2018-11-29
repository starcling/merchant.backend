import {JsonController, Res, Get, Param, QueryParam} from 'routing-controllers';
import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { TransactionConnector } from '../../connectors/api/v1/TransactionConnector';
import { ITransactionGet } from '../../core/transaction/models';
import { GetTransactionValidator } from '../../validators/TransactionValidator/GetTransactionValidator';

@JsonController('/transactions')
export class TransactionController {

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