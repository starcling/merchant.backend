import { IPaymentInsertDetails, IPaymentUpdateDetails } from './models';
import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { HTTPResponseCodes } from '../../utils/web/HTTPResponseCodes';
import { MerchantSDK } from '../MerchantSDK';
import { Globals } from '../../utils/globals';

export class Payment {
    public constructor() {
        MerchantSDK.GET_SDK().build(Globals.GET_DEFAULT_SDK_BUILD());
    }

    /**
     * @description Create method for inserting payment into DB
     * @param {IPaymentInsertDetails} payment payment object
     * @returns {HTTPResponse} Returns success feedback
     */
    public async createPayment(payment: IPaymentInsertDetails) {
        try {
            const result = await MerchantSDK.GET_SDK().createPayment(payment);

            return new HTTPResponseHandler().handleSuccess('Successful payment insert.', result.data[0]);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to insert payment', error);
        }
    }

    /**
     * @description Get method for getting single payment from DB
     * @param {string} paymentID ID of the payment
     * @returns {HTTPResponse} Returns response with payment object in data
     */
    public async getPayment(paymentID: string) {
        try {
            const response = await MerchantSDK.GET_SDK().getPayment(paymentID);
            if (response.data[0].id === null) {

                return new HTTPResponseHandler().handleFailed('Payment with supplied ID not found.', null, HTTPResponseCodes.BAD_REQUEST());
            }

            return new HTTPResponseHandler().handleSuccess('Successfully retrieved single payment.', response.data[0]);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to retrieve single payment.', error);
        }
    }

    /**
     * @description Delete method for removing a payment from DB
     * @param {string} paymentID ID of the payment
     * @returns {HTTPResponse} Returns success feedback
     */
    public async deletePayment(paymentID: string) {
        try {
            const response = await MerchantSDK.GET_SDK().deletePayment(paymentID);
            if (response.data[0].fc_delete_payment) {
                return new HTTPResponseHandler().handleSuccess('Successfully deleted single payment.', {});

            }

            return new HTTPResponseHandler().handleFailed('No payment with given ID.', {});

        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to delete single payment.', error);
        }
    }

    /**
     * @description Get method for getting all payments from DB
     * @returns {HTTPResponse} Returns response with array of payments in data
     */
    public async getAllPayments() {
        try {
            const response = await MerchantSDK.GET_SDK().getAllPayments();
            if (!response.data) {
                response.data = [];
            }

            return new HTTPResponseHandler().handleSuccess('Successfully retrieved payments.', response.data);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to retrieve payments.', error);
        }
    }

    /**
     * @description Create method for updating a payment in DB
     * @param {IPaymentUpdateDetails} payment payment object
     * @returns {HTTPResponse} Returns success feedback
     */
    public async updatePayment(payment: IPaymentUpdateDetails) {
        try {
            const response = await MerchantSDK.GET_SDK().updatePayment(payment);
            if (payment.registerTxHash && payment.registerTxHash.indexOf('0x') !== -1) {
                MerchantSDK.GET_SDK().monitorTransaction(payment.registerTxHash, payment.id);
            }

            return new HTTPResponseHandler().handleSuccess('Successful payment update.', response.data[0]);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to update payment', error);
        }
    }
}