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
    public update (payment: IPaymentUpdateDetails) {
        try {
            //do logic here
            return new HTTPResponseHandler().handleSuccess('Successful payment update.', null);
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed to update payment', error);
        }
    }
}