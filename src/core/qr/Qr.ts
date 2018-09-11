import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { MerchantSDK } from '../MerchantSDK';

export class Qr {
    /**
     * @description Get method for getting payment from DB
     * @param {string} paymentID paymentID of the object
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
}