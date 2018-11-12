import { JsonController, Res, Get, Param } from 'routing-controllers';
import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { QrConnector } from '../../connectors/api/v1/QrConnector';
import { GetQrValidator } from '../../validators/QrValidator/GetQrValidator';
import { GetEtherPushQrCode } from '../../validators/QrValidator/GetEtherPushQrCode';
import { IErc20PushQrCodeDetails, IEtherPushQrCodeDetails } from '../../core/qr/models';
import { GetErc20PushQrCode } from '../../validators/QrValidator/GetErc20PushQrCode';

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
     * @apiDescription Get QR code for Ethernet push transactions
     *
     * @apiName getEthPushQrCode
     * @apiGroup QrController
     * @apiVersion  1.0.0
     *
     * @apiParam {string} address - Wallet address
     * @apiParam {string} value - Amount value
     * @apiParam {numnber} gas - Gas value
     *
     * @apiParamExample {json} Request-Example:
     * {
         "address": "0xa9acc3a896548b6afb4e94c0731b04a2982f3c9c",
         "value": "32458723409853475",
         "gas": 354
     * }
     *
     * @apiSuccess (200) {array} QR details for Etherium push transactions
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
                    gas: gas
                });

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
     * @api {get} /api/v2/qr/:tokenAddress/:address/:value/:gas
     * @apiDescription Get QR code for Erc20 push transactions
     *
     * @apiName getErc20PushQrCode
     * @apiGroup QrController
     * @apiVersion  1.0.0
     * @apiParam {string} tokenAddress - Contract address
     * @apiParam {string} address - Wallet address
     * @apiParam {string} value - Amount value
     * @apiParam {numnber} gas - Gas value
     *
     * @apiParamExample {json} Request-Example:
     * {
     *   "tokenAddress": "0x11c1e537801cc1c37ad6e1b7d0bdc0e00fcc6dc1",
         "address": "0xa9acc3a896548b6afb4e94c0731b04a2982f3c9c",
         "value": "32458723409853475",
         "gas": 354
     * }
     *
     * @apiSuccess (200) {array} QR details for Erc20 tokens push transactions
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
                    gas: gas
                });

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }
}