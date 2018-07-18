//import { JsonController, Body, Res, Param, Get, Put, QueryParam } from 'routing-controllers';
import { JsonController, Res, Post, Body } from 'routing-controllers';
import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { PaymentConnector } from '../../connectors/api/v1/PaymentConnector';
import { IPaymentInsertDetails } from '../../core/payment/models';
import { CreatePaymentValidator } from '../../validators/PaymentValidator/CreatePaymentValidator';

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
  * @apiParam {number} startts - Start timestamp of payment
  * @apiParam {number} endts - End timestamp of payment
  * @apiParam {number} type - Type of payment
  * @apiParam {number} frequency - Frequency of execution
  *
  * @apiParamExample {json} Request-Example:
  *    {
  *       "title": "string",
  *       "description": "string",
  *       "status": 1,
  *       "amount": 43,
  *       "currency": "string",
  *       "startts": 10,
  *       "endts": 13,
  *       "type": 1,
  *       "frequency": 10
  *    }
  *
  * @apiSuccess (200) {string} menmonic data
  *
	*/
  @Post('/')
  public async create(@Body() payment: IPaymentInsertDetails, @Res() response: any): Promise<any> {
    try {
      new CreatePaymentValidator().validate(payment);
      const result = await new PaymentConnector().create(payment);

      return new APIResponseHandler().handle(response, result);
    } catch (error) {
      return new APIResponseHandler().handle(response, error);
    }
  }

}