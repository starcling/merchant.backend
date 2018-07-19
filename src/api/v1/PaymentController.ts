import { JsonController, Res, Post, Body, Put, Patch, QueryParam, Param } from 'routing-controllers';
import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { PaymentConnector } from '../../connectors/api/v1/PaymentConnector';
import { IPaymentInsertDetails, IPaymentUpdateDetails } from '../../core/payment/models';
import { CreateValidator } from '../../validators/PaymentValidator/CreateValidator';
import { UpdateValidator } from '../../validators/PaymentValidator/UpdateValidator';
import { PatchValidator } from '../../validators/PaymentValidator/PatchValidator';

@JsonController('/payments')
export class PaymentController {

    /**
    * @apiDefine Response
    * @apiSuccess {number} status The HTTP status of the call
    * @apiSuccess {string} message A human-friendly summary of the result of the call
    */

    /**
      * @api {post} /api/v1/payments/
    * @apiDescription Create a new payment in DB
    *
    * @apiName create
    * @apiGroup PaymentController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} title - Title of the payment
    * @apiParam {string} description - Description of the payment
    * @apiParam {number} status - Status of payment
    * @apiParam {number} amount - Amount of payment
    * @apiParam {string} currency - Currency of payment
    * @apiParam {number} startTimestamp - Start timestamp of payment
    * @apiParam {number} endTimestamp - End timestamp of payment
    * @apiParam {number} type - Type of payment
    * @apiParam {number} frequency - Frequency of execution
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "title": "string",
    *   "description": "string",
    *   "status": 1,
    *   "amount": 43,
    *   "currency": "string",
    *   "startTimestamp": 10,
    *   "endTimestamp": 13,
    *   "type": 1,
    *   "frequency": 10
    * }
    *
    * @apiSuccess (200) {string} menmonic data
    *
      */
    @Post('/')
    public async create(@Body() payment: IPaymentInsertDetails, @Res() response: any): Promise<any> {
        try {
            new CreateValidator().validate(payment);
            const result = await new PaymentConnector().create(payment);

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
    * @apiDefine Response
    * @apiSuccess {number} status The HTTP status of the call
    * @apiSuccess {string} message A human-friendly summary of the result of the call
    */

    /**
      * @api {put} /api/v1/payments/
    * @apiDescription Update existing payment in DB
    *
    * @apiName update
    * @apiGroup PaymentController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} paymentID - Payment ID
    * @apiParam {string} title - Title of the payment
    * @apiParam {string} description - Description of the payment
    * @apiParam {string} promo - Promo code for the payment
    * @apiParam {number} status - Status of payment
    * @apiParam {string} customerAddress -
    * @apiParam {number} amount - Amount of payment
    * @apiParam {string} currency - Currency of payment
    * @apiParam {number} startTimestamp - Start timestamp of payment
    * @apiParam {number} endTimestamp - End timestamp of payment
    * @apiParam {number} type - Type of payment
    * @apiParam {number} frequency - Frequency of execution
    * @apiParam {string} transactionHash - Transaction has for payment
    * @apiParam {string} debitAccount - Debit account for payment
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "title": "string",
    *   "description": "string",
    *   "promo": "string",
    *   "status": 1,
    *   "customerAddress": "string",
    *   "amount": 50,
    *   "currency": "string",
    *   "startTimestamp": 10,
    *   "endTimestamp": 11,
    *   "type": 1,
    *   "frequency": 10,
    *   "transactionHash":"string",
    *   "debitAccount": "string"
    * }
    *
    * @apiSuccess (200) {string} menmonic data
    *
      */
    @Put('/:paymentID')
    public async update(@Param('paymentID') paymentID: string, @Body() payment: IPaymentUpdateDetails, @Res() response: any): Promise<any> {
        try {
            payment.id = paymentID;
            new UpdateValidator().validate(payment);
            const result = await new PaymentConnector().update(payment);

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
    * @apiDefine Response
    * @apiSuccess {number} status The HTTP status of the call
    * @apiSuccess {string} message A human-friendly summary of the result of the call
    */

    /**
      * @api {patch} /api/v1/payments/:id
    * @apiDescription Update existing payment in DB
    *
    * @apiName patch
    * @apiGroup PaymentController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} paymentID - Payment ID
    * @apiParam {string} title - Title of the payment
    * @apiParam {string} description - Description of the payment
    * @apiParam {string} promo - Promo code for the payment
    * @apiParam {number} status - Status of payment
    * @apiParam {string} customerAddress -
    * @apiParam {number} amount - Amount of payment
    * @apiParam {string} currency - Currency of payment
    * @apiParam {number} startTimestamp - Start timestamp of payment
    * @apiParam {number} endTimestamp - End timestamp of payment
    * @apiParam {number} type - Type of payment
    * @apiParam {number} frequency - Frequency of execution
    * @apiParam {string} transactionHash - Transaction has for payment
    * @apiParam {string} debitAccount - Debit account for payment
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "id": "string",
    *   "title": "string",
    *   "description": "string",
    *   "promo": "string",
    *   "status": 1,
    *   "customerAddress": "string",
    *   "amount": 50,
    *   "currency": "string",
    *   "startTimestamp": 10,
    *   "endTimestamp": 11,
    *   "type": 1,
    *   "frequency": 10,
    *   "transactionHash":"string",
    *   "debitAccount": "string"
    * }
    *
    * @apiSuccess (200) {string} menmonic data
    *
      */
    @Patch('/:paymentID')
    public async patch(@Param('paymentID') paymentID: string,
        @QueryParam('title') title: string = null,
        @QueryParam('description') description: string = null,
        @QueryParam('promo') promo: string = null,
        @QueryParam('status') status: number = null,
        @QueryParam('customerAddress') customerAddress: string = null,
        @QueryParam('amount') amount: number = null,
        @QueryParam('currency') currency: string = null,
        @QueryParam('startTimestamp') startTimestamp: number = null,
        @QueryParam('endTimestamp') endTimestamp: number = null,
        @QueryParam('type') type: number = null,
        @QueryParam('frequency') frequency: number = null,
        @QueryParam('transactionHash') transactionHash: string = null,
        @QueryParam('debitAccount') debitAccount: string = null,
        @Res() response: any): Promise<any> {

        const payment = <IPaymentUpdateDetails>{
            id: paymentID,
            title: title,
            description: description,
            promo: promo,
            status: status,
            customerAddress: customerAddress,
            amount: amount,
            currency: currency,
            startTimestamp: startTimestamp,
            endTimestamp: endTimestamp,
            type: type,
            frequency: frequency,
            transactionHash: transactionHash,
            debitAccount: debitAccount
        };

        try {
            new PatchValidator().validate(payment);
            const result = await new PaymentConnector().update(payment);

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

}