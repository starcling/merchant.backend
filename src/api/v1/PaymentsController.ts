import { JsonController, Res, Post, Body, Get, Param, Delete } from 'routing-controllers';
import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { IPaymentInsert } from '../../core/payment/models';
import { PaymentConnector } from '../../connectors/api/v1/PaymentConnector';
import { CreatePaymentValidator } from '../../validators/PaymentValidator/CreatePaymentValidator';
import { GetPaymentValidator } from '../../validators/PaymentValidator/GetPaymentValidator';
import { DeletePaymentValidator } from '../../validators/PaymentValidator/DeletePaymentValidator';

@JsonController('/payments')
export class PaymentsController {

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
    * @apiDescription Create a new Payment in DB
    *
    * @apiName create
    * @apiGroup PaymentsController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} title - Title of the Payment
    * @apiParam {string} description - Description of the Payment
    * @apiParam {number} amount - Amount of Payment
    * @apiParam {string} currency - Currency of Payment
    * @apiParam {number} startTimestamp - Start timestamp of Payment
    * @apiParam {number} endTimestamp - End timestamp of Payment
    * @apiParam {number} type - Type of Payment
    * @apiParam {string} merchantAddress - Ethereum wallet address of merchant
    * @apiParam {number} frequency - Frequency of execution
    * @apiParam {number} networkID - ETH Network ID - 1 mainnet / 3 ropsten
    *
    * @apiParamExample {json} Request-Example:
    * {
    * }
    *
    * @apiSuccess (200) {object} Payment Details
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
    * @api {get} /api/v1/payments/
    * @apiDescription Retrieve an array of payments
    *
    * @apiName getAllPayments
    * @apiGroup PaymentsController
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
    * @api {get} /api/v1/payments/:paymentModelID
    * @apiDescription Retrieves a single Payment
    *
    * @apiName getPaymentByID
    * @apiGroup PaymentsController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} paymentModelID - ID of the Payment
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "paymentID": "24947f2e-9164-11e8-bc8e-27e75bf6baf4"
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
    * @api {delete} /api/v1/payments/:paymentID
    * @apiDescription Delete a single Payment
    *
    * @apiName deletePayment
    * @apiGroup PaymentsController
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