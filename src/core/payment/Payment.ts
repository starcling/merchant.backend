import { IPaymentInsertDetails, IPaymentUpdateDetails } from './models';
import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { PaymentDbConnector } from '../../connectors/dbConnector/paymentsDBconnector';

export class Payment {

    /**
     * @description Create method for inserting payment into DB
     * @param {IPaymentInsertDetails} payment payment object
     * @returns {HTTPResponse} Returns success feedback
     */
    public async create (payment: IPaymentInsertDetails) {
        try {
            const result = await new PaymentDbConnector().insertPayment(payment);

            return new HTTPResponseHandler().handleSuccess('Successful payment insert.', result.data[0]);
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed to insert payment', error);
        }
    }

    /**
     * @description Create method for updating a payment in DB
     * @param {IPaymentUpdateDetails} payment payment object
     * @returns {HTTPResponse} Returns success feedback
     */
    public async update (payment: IPaymentUpdateDetails) {
        try {
            const result = await new PaymentDbConnector().updatePayment(payment);

            return new HTTPResponseHandler().handleSuccess('Successful payment update.', result.data[0]);
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed to update payment', error);
        }
    }
}