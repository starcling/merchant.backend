import { IPaymentInsertDetails, IPaymentUpdateDetails } from './models';
import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { HTTPResponseCodes } from '../../utils/web/HTTPResponseCodes';
import { PaymentDbConnector } from '../../connectors/dbConnector/paymentsDBconnector';
import { MerchantSDK } from '../MerchantSDK';

export class Payment {

    public constructor() {
        MerchantSDK.GET_SDK().build({merchantApiUrl: 'http://merchant_server:3000/api/v1/'});
    }

    /**
     * @description Create method for inserting payment into DB
     * @param {IPaymentInsertDetails} payment payment object
     * @returns {HTTPResponse} Returns success feedback
     */
    public async create(payment: IPaymentInsertDetails) {
        try {
            const result = await new PaymentDbConnector().insertPayment(payment);

            return new HTTPResponseHandler().handleSuccess('Successful payment insert.', result.data[0]);
        } catch (error) {
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
            const response = await new PaymentDbConnector().getSinglePayment(paymentID);
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
     * @description Get method for getting all payments from DB
     * @returns {HTTPResponse} Returns response with array of payments in data
     */
    public async getAllPayments() {
        try {
            const response = await new PaymentDbConnector().getAllPayments();
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
    public async update(payment: IPaymentUpdateDetails) {
        try {
            const result = await new PaymentDbConnector().updatePayment(payment);
            if (payment.transactionHash) {
                console.log('monitor transaction');
                MerchantSDK.GET_SDK().monitorTransaction(payment.transactionHash, payment.id);
            }

            return new HTTPResponseHandler().handleSuccess('Successful payment update.', result.data[0]);
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed to update payment', error);
        }
    }
}