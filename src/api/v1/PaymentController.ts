import { JsonController, Res, Post, Body, Put, Patch, Param, Get, Delete } from 'routing-controllers';
import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { PaymentConnector } from '../../connectors/api/v1/PaymentConnector';
import { IPaymentInsertDetails, IPaymentUpdateDetails } from '../../core/payment/models';
import { CreatePaymentValidator } from '../../validators/PaymentValidator/CreatePaymentValidator';
import { UpdateValidator } from '../../validators/PaymentValidator/UpdateValidator';
import { PatchValidator } from '../../validators/PaymentValidator/PatchValidator';
import { GetPaymentValidator } from '../../validators/PaymentValidator/GetPaymentValidator';
import { DeletePaymentValidator } from '../../validators/PaymentValidator/DeletePaymentValidator';

@JsonController('/payments')
export class PaymentController {

    /**
    * @apiDefine Response
    * @apiSuccess {boolean} success The HTTP success of the call
    * @apiSuccess {number} status The HTTP status of the call
    * @apiSuccess {string} message A human-friendly summary of the result of the call
    * @apiSuccess {object} data The response data of the call
    *
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
    *   "amount": 43,
    *   "currency": "string",
    *   "startTimestamp": 10,
    *   "endTimestamp": 13,
    *   "type": 1,
    *   "frequency": 10
    * }
    *
    * @apiSuccess (200) {object} Payment Details
    *
    */
    @Post('/')
    public async create(@Body() payment: IPaymentInsertDetails, @Res() response: any): Promise<any> {
        try {
            new CreatePaymentValidator().validate(payment);
            const result = await new PaymentConnector().createPayment(payment);

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
    * @api {get} /api/v1/payments/paymentID
    * @apiDescription Retrieves a single payment
    *
    * @apiName getPayment
    * @apiGroup PaymentController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} paymentID - ID of the payment
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "paymentID": "32049572038495"
    * }
    *
    * @apiSuccess (200) {object} Payment details for a specific id
    *
    */
    @Get('/:paymentID')
    public async getPayment(@Param('paymentID') paymentID: string, @Res() response: any): Promise<any> {
        try {
            new GetPaymentValidator().validate({ paymentID });
            const result = await new PaymentConnector().getPayment(paymentID);

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
    * @api {put} /api/v1/payments/paymentID
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
    * @apiParam {string} registerTxHash - Transaction hash for register pull payment
    * @apiParam {string} executeTxHash - Transaction hash for execute pull payment
    * @apiParam {number} executeTxStatus - Transaction hash status for execute pull payment
    * @apiParam {string} debitAccount - Debit account for payment
    * @apiParam {string} merchantAddress - Debit account for payment
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
    *   "registerTxHash":"string",
    *   "executeTxHash":"string",
    *   "executeTxStatus": 1,
    *   "debitAccount": "string"
    *   "merchantAddress": "string"
    * }
    *
    * @apiSuccess (200) {object} updated payment details
    *
    */
    @Put('/:paymentID')
    public async update(@Param('paymentID') paymentID: string, @Body() payment: IPaymentUpdateDetails, @Res() response: any): Promise<any> {
        try {
            payment.id = paymentID;
            new UpdateValidator().validate(payment);
            const result = await new PaymentConnector().updatePayment(payment);
            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
    * @api {get} /api/v1/payments/
    * @apiDescription Retrieve an array of payments
    *
    * @apiName getAllPayments
    * @apiGroup PaymentController
    * @apiVersion  1.0.0
    *
    * @apiSuccess (200) {object} Payment Details
    *
    */
    @Get('/')
    public async getAllPayments(@Res() response: any): Promise<any> {
        try {
            const result = await new PaymentConnector().getAllPayments();

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
    * @api {patch} /api/v1/payments/paymentID
    * @apiDescription Patch existing payment in DB
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
    * @apiParam {string} registerTxHash - Transaction hash for register pull payment
    * @apiParam {string} executeTxHash - Transaction hash for execute pull payment
    * @apiParam {number} executeTxStatus - Transaction hash status for execute pull payment
    * @apiParam {string} debitAccount - Debit account for payment
    * @apiParam {string} merchantAddress - Debit account for payment
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
    *   "registerTxHash":"string",
    *   "executeTxHash":"string",
    *   "executeTxStatus": 1,
    *   "debitAccount": "string"
    *   "merchantAddress": "string"
    * }
    *
    * @apiSuccess (200) {object} Payment Details
    *
    */
    @Patch('/:paymentID')
    public async patch(@Param('paymentID') paymentID: string, @Body() payment: IPaymentUpdateDetails, @Res() response: any): Promise<any> {
        try {
            payment.id = paymentID;
            new PatchValidator().validate(payment);
            const result = await new PaymentConnector().updatePayment(payment);
            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
    * @api {delete} /api/v1/payments/paymentID
    * @apiDescription Delete a single payment
    *
    * @apiName deletePayment
    * @apiGroup PaymentController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} paymentID - ID of the payment
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "paymentID": "32049572038495"
    * }
    *
    * @apiSuccess (200) {object} no data
    *
    */
   @Delete('/:paymentID')
   public async deletePayment(@Param('paymentID') paymentID: string, @Res() response: any): Promise<any> {
       try {
           new DeletePaymentValidator().validate({ paymentID });
           const result = await new PaymentConnector().deletePayment(paymentID);

           return new APIResponseHandler().handle(response, result);
       } catch (error) {
           return new APIResponseHandler().handle(response, error);
       }
   }

}