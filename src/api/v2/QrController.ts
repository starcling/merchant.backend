import {JsonController, Res, Get, Param, UseBefore} from 'routing-controllers';
import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { QrConnector } from '../../connectors/api/v1/QrConnector';
import { GetQrValidator } from '../../validators/QrValidator/GetQrValidator';
import { MobileValidationMiddleware } from '../../middleware/MobileValidationMiddleware';
import {GetEtherPushQrCode} from '../../validators/QrValidator/GetEtherPushQrCode';
import {IErc20PushQrCodeDetails, IEtherPushQrCodeDetails} from '../../core/qr/models';
import {GetErc20PushQrCode} from '../../validators/QrValidator/GetErc20PushQrCode';

@JsonController('/qr')
@UseBefore(MobileValidationMiddleware)

export class QrController {

    /**
    * @apiDefine Response
    * @apiSuccess {boolean} success The HTTP success of the call
    * @apiSuccess {number} status The HTTP status of the call
    * @apiSuccess {string} message A human-friendly summary of the result of the call
    * @apiSuccess {object} data The response data of the call
    */

    /**
    * @api {get} /api/v2/qr/:paymentID
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
    * @apiSuccess (200) {array} QR details for payment
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

    /**
     * @api {get} /api/v2/qr/:address/value/gas
     * @apiDescription PENDING
     *
     * @apiName getEthPushQrCode
     * @apiGroup QrController
     * @apiVersion  1.0.0
     *
     * @apiParam {string} address - PENDING
     * * @apiParam {string} value - PENDING
     * * @apiParam {numnber} gas - PENDING
     *
     * @apiParamExample {json} Request-Example:
     * {
     *   "to": "0x0000000000000000000000000000000000000000",
         "value": "23c534fe8c9711e8b47f9a38301a1e03",
         "gas": 354.65,
         "data": ""
     * }
     *
     * @apiSuccess (200) {array} QR details for payment
     *
     */
    @Get('/:address/:value/:gas')
    public async getEthPushQrCode(@Param('address') address: string,
                                  @Param('value') value: string,
                                  @Param('gas') gas: number,
                                  @Res() response: any): Promise<any> {
        try {
            new GetEtherPushQrCode().validate({ address, value, gas });

            const result = await new QrConnector().getEtherQrCode(
                <IEtherPushQrCodeDetails>{
                    address: address,
                    value: value,
                    gas: gas });

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
     * @api {get} /api/v2/qr/:tokenAddress/:address/:value/:gas
     * @apiDescription PENDING
     *
     * @apiName getErc20PushQrCode
     * @apiGroup QrController
     * @apiVersion  1.0.0
     * @apiParam {string} tokenAddress - PENDING
     * @apiParam {string} address - PENDING
     * @apiParam {string} value - PENDING
     * @apiParam {numnber} gas - PENDING
     *
     * @apiParamExample {json} Request-Example:
     * {
     *   "to": "0x0000000000000000000000000000000000000000",
         "value": "23c534fe8c9711e8b47f9a38301a1e03",
         "gas": 354.65,
         "data": ""
     * }
     *
     * @apiSuccess (200) {array} QR details for payment
     *
     */
    @Get('/:tokenAddress/:address/:value/:gas')
    public async getErc20PushQrCode(@Param('tokenAddress') tokenAddress: string,
                                    @Param('address') address: string,
                                    @Param('value') value: string,
                                    @Param('gas') gas: number,
                                    @Res() response: any): Promise<any> {
        try {
            new GetErc20PushQrCode().validate({ tokenAddress, address, value, gas });
            const result = await new QrConnector().getErc20QrCode(
                <IErc20PushQrCodeDetails>{
                    tokenAddress: tokenAddress,
                    address: address,
                    value: value,
                    gas: gas});

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }
}