import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { MerchantSDK } from '../MerchantSDK';
import {IErc20PushQrCodeDetails, IEtherPushQrCodeDetails} from '../../core/qr/models';

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
     * @description Get method for getting QR code details for Etherium push transactions from Merchant SDK
     * @param {IEtherPushQrCodeDetails} qrCodeForEther - Etherium push transaction QR code details
     * @returns {HTTPResponse} Returns success feedback
     */
    public getEtherQrCode (qrCodeForEther: IEtherPushQrCodeDetails) {
        try {
            const result = MerchantSDK.GET_SDK().generateEthPushQRCode(
                qrCodeForEther.address,
                qrCodeForEther.value,
                qrCodeForEther.gas);

            return new HTTPResponseHandler().handleSuccess('Successfully retrieved the QR code.', result);
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed retrieve QR code.', error);
        }
    }

    /**
     * @description Get method for getting QR code details for ERC20 push transactions from Merchant SDK
     * @param {IErc20PushQrCodeDetails} getErc20QrCode - ERC20 push transaction QR code details
     * @returns {HTTPResponse} Returns success feedback
     */
    public async getErc20QrCode (qrCodeForEther: IErc20PushQrCodeDetails) {
        try {
            const result = await MerchantSDK.GET_SDK().generateErc20PushQRCode(
                qrCodeForEther.tokenAddress,
                qrCodeForEther.address,
                qrCodeForEther.value,
                qrCodeForEther.gas);

            return new HTTPResponseHandler().handleSuccess('Successfully retrieved the QR code.', result);
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed retrieve QR code.', error);
        }
    }
}