import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { MerchantSDK } from '../MerchantSDK';
import {IEtherPushQrCodeDetails} from '../../core/qr/models';

export class Qr {
    /**
     * @description Get method for getting paymentModel from DB
     * @param {string} paymentID pullPaymentModelID of the object
     * @returns {HTTPResponse} Returns success feedback
     */
    public getQRCode (paymentID: string) {
        try {
            const result = MerchantSDK.GET_SDK().generateQRCode(paymentID);

            return new HTTPResponseHandler().handleSuccess('Successfully retrieved the QR code.', result);
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed retrieve QR code.', error);
        }
    }

    /**
     * @description Get method for getting PENDING
     * @param {IEtherPushQrCodeDetails} qrCodeForEther PENDING
     * @returns {HTTPResponse} Returns success feedback
     */
    public getEtherQrCode (qrCodeForEther: IEtherPushQrCodeDetails) {
        try {
            // const result = MerchantSDK.GET_SDK().generateQRCode(paymentID);
            const result = {
                to: qrCodeForEther.address,
                value: qrCodeForEther.value,
                gas: qrCodeForEther.gas,
                data: null
            };

            return new HTTPResponseHandler().handleSuccess('Successfully retrieved the QR code.', result);
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed retrieve QR code.', error);
        }
    }
}