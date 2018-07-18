import { JsonController, Res, Post, Body, Get, Param } from 'routing-controllers';
import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { QrConnector } from '../../connectors/api/v1/QrConnector';
import { GetQrValidator } from '../../validators/QrValidator/GetQrValidator';

@JsonController('/qr')
export class QrController {

    /**
    * @apiDefine Response
    * @apiSuccess {number} status The HTTP status of the call
    * @apiSuccess {string} message A human-friendly summary of the result of the call
    */

    /**
      * @api {post} /api/v1/qr/
    * @apiDescription Create a new payment in DB
    *
    * @apiName create
    * @apiGroup PaymentController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} paymentID - ID of the payment
    *
    * @apiParamExample {json} Request-Example:
    *    {
    *       "paymentID": "27346059273640597263495"
    *    }
    *
    * @apiSuccess (200) {string} menmonic data
    *
      */
    @Get('/:paymentID')
    public async get(@Param('paymentID') paymentID: string, @Res() response: any): Promise<any> {
        try {
            new GetQrValidator().validate({ paymentID });
            const result = await new QrConnector().get(paymentID);

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

}