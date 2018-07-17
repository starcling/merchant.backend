//import { JsonController, Body, Res, Param, Get, Put, QueryParam } from 'routing-controllers';
import { JsonController, Res, Post, Body } from 'routing-controllers';
import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { PaymentConnector } from '../../connectors/api/v1/PaymentConnector';
import { PaymentInsertDetails } from '../../core/payment/models';
import { CreateValidator } from '../../validators/PaymentValidator/CreateValidator';

@JsonController('/payments')
export class PaymentController {

  /**
  * @apiDefine Response
  * @apiSuccess {number} status The HTTP status of the call
  * @apiSuccess {string} message A human-friendly summary of the result of the call
  */

  /**
	* @api {post} /api/v1/payment/
  * @apiDescription Create a new payment in DB
  *
  * @apiName create
  * @apiGroup PaymentController
  * @apiVersion  1.0.0
  *
  * @apiParam {number} network - Network id
  *
  * @apiParamExample {json} Request-Example:
  *    {
  *       "network": "1"
  *    }
  *
  * @apiSuccess (200) {string} menmonic data
  *
	*/
  @Post('/')
  public async create(@Body() payment: PaymentInsertDetails, @Res() response: any): Promise<any> {
    try {
      new CreateValidator().validate(payment);
      const result = await new PaymentConnector().create(payment);

      return new APIResponseHandler().handle(response, result);
    } catch (error) {
      return new APIResponseHandler().handle(response, error);
    }
  }

}