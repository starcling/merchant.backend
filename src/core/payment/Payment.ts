import { IPaymentInsertDetails, IPaymentUpdateDetails } from './models';
import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { HTTPResponseCodes } from '../../utils/web/HTTPResponseCodes';
import { PaymentDbConnector } from '../../connectors/dbConnector/PaymentDbConnector';
import { HTTPRequestFactory } from '../../utils/web/HTTPRequestFactory';

export class Payment {
    /**
     * @description Create method for inserting payment into DB
     * @param {IPaymentInsertDetails} payment payment object
     * @returns {HTTPResponse} Returns success feedback
     */
    public async createPayment(payment: IPaymentInsertDetails) {
        try {
            const result = await new PaymentDbConnector().createPayment(payment);

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
            const response = await new PaymentDbConnector().getPayment(paymentID);
            if (response.data[0].id === null) {

                return new HTTPResponseHandler().handleFailed('Payment with supplied ID not found.', null, HTTPResponseCodes.BAD_REQUEST());
            }
            try {
                const httpRequest = new HTTPRequestFactory()
                    .create('http://18.185.130.3/core/api/v1/merchant/' + response.data[0].merchantID, {
                        'Content-Type': 'application/json'
                    }, 'GET', null, null);
                const httpResponse = await httpRequest.getResponse();
                response.data[0].merchantName = JSON.parse(httpResponse.body).data.businessName;
            } catch (err) {
                console.log(err);
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
            const response = await new PaymentDbConnector().deletePayment(paymentID);
            if (response.data[0].fc_delete_payment) {
                return new HTTPResponseHandler().handleSuccess('Successfully deleted single payment.', {});

            }

            return new HTTPResponseHandler().handleFailed('No payment with given ID.', {}, HTTPResponseCodes.BAD_REQUEST());

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
    public async updatePayment(payment: IPaymentUpdateDetails) {
        try {
            const response = await new PaymentDbConnector().updatePayment(payment);

            return new HTTPResponseHandler().handleSuccess('Successful payment update.', response.data[0]);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to update payment', error);
        }
    }
}