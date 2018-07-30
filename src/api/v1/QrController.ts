import { JsonController, Res, Get, Param } from 'routing-controllers';
import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { QrConnector } from '../../connectors/api/v1/QrConnector';
import { GetQrValidator } from '../../validators/QrValidator/GetQrValidator';

@JsonController('/qr')
export class QrController {

    /**
    * @apiDefine Response
    * @apiSuccess {boolean} success The HTTP success of the call
    * @apiSuccess {number} status The HTTP status of the call
    * @apiSuccess {string} message A human-friendly summary of the result of the call
    * @apiSuccess {object} data The response data of the call
    */

    /**
    * @api {get} /api/v1/qr/:paymentID
    * @apiDescription Gets generated qr code from the SDK
    *
    * @apiName getQRCode
    * @apiGroup QrController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} paymentID - ID of the payment
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "paymentID": "c90de9da-8b44-11e8-a3da-774835f29b05"
    * }
    *
    * @apiSuccess (200) {array} payment details
    *
      */
    @Get('/:paymentID')
    public async getQRCode(@Param('paymentID') paymentID: string, @Res() response: any): Promise<any> {
        try {
            new GetQrValidator().validate({ paymentID });
            const result = await new QrConnector().getQRCode(paymentID);

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

}