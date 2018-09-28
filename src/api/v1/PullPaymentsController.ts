import { JsonController, Res, Post, Body, Get, Param, Delete } from 'routing-controllers';
import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { IPaymentInsert } from '../../core/payment/models';
import { PaymentConnector } from '../../connectors/api/v1/PaymentConnector';
import { CreatePaymentValidator } from '../../validators/PaymentValidator/CreatePaymentValidator';
import { GetPaymentValidator } from '../../validators/PaymentValidator/GetPaymentValidator';
import { DeletePaymentValidator } from '../../validators/PaymentValidator/DeletePaymentValidator';

@JsonController('/pull-payments')
export class PullPaymentsController {

    /**
    * @apiDefine Response
    * @apiSuccess {boolean} success The HTTP success of the call
    * @apiSuccess {number} status The HTTP status of the call
    * @apiSuccess {string} message A human-friendly summary of the result of the call
    * @apiSuccess {object} data The response data of the call
    *
    */

    /**
    * @api {post} /api/v1/pull-payments/
    * @apiDescription Create a new Payment in DB
    *
    * @apiName createPayment
    * @apiGroup PullPaymentsController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} pullPaymentModelID - The id of the pull payment model
    * @apiParam {number} numberOfPayments - The amount of time you can execute a pull payment model
    * @apiParam {number} startTimestamp - The start timestamp of the pull payment
    * @apiParam {string} customerAddress - The ethereum wallet address of customer
    * @apiParam {string} pullPaymentAddress - The pull payment address
    * @apiParam {string} userID - The id of the user
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "pullPaymentModelID": "2c4defb8-c25e-11e8-a47a-db2aef6722d6",
    *   "numberOfPayments": 5,
    *   "startTimestamp": "1538057110",
    *   "customerAddress": "0x9d11DDd84198B30E56E31Aa89227344Cdb645e34",
    *   "pullPaymentAddress": " 0x7990fc1d2527d00c22db4c2b72e3e74f80b97d9c",
    *   "userID": "123456"
    * }
    *
    * @apiSuccess (200) {object} New Payment Details
    *
    */
    @Post('/')
    public async createPayment(@Body() payment: IPaymentInsert, @Res() response: any): Promise<any> {
        try {
            new CreatePaymentValidator().validate(payment);
            const result = await new PaymentConnector().createPayment(payment);

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
    * @api {get} /api/v1/pull-payments/
    * @apiDescription Retrieve an array of payments
    *
    * @apiName getAllPayments
    * @apiGroup PullPaymentsController
    * @apiVersion  1.0.0
    *
    * @apiSuccess (200) {object} All Payments Details
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
    * @api {get} /api/v1/pull-payments/:paymentID
    * @apiDescription Retrieves pull payment by id
    *
    * @apiName getPaymentByID
    * @apiGroup PullPaymentsController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} paymentID - ID of the Payment
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "pullPaymentModelID": "24947f2e-9164-11e8-bc8e-27e75bf6baf4"
    * }
    *
    * @apiSuccess (200) {object} Payment details for a specific id
    *
    */
    @Get('/:paymentID')
    public async getPaymentByID(@Param('paymentID') paymentID: string, @Res() response: any): Promise<any> {
        try {
            new GetPaymentValidator().validate({ paymentID });
            const result = await new PaymentConnector().getPaymentByID(paymentID);

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
    * @api {delete} /api/v1/pull-payments/:paymentID
    * @apiDescription Delete a single Payment
    *
    * @apiName deletePaymentByID
    * @apiGroup PullPaymentsController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} paymentID - ID of the Payment
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
   public async deletePaymentByID(@Param('paymentID') paymentID: string, @Res() response: any): Promise<any> {
       try {
           new DeletePaymentValidator().validate({ paymentID });
           const result = await new PaymentConnector().deletePaymentByID(paymentID);

           return new APIResponseHandler().handle(response, result);
       } catch (error) {
           return new APIResponseHandler().handle(response, error);
       }
   }
}