import { PaymentInsertDetails } from './models';
import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';

export class Payment {

    /**
     * @description Create method for inserting payment into DB
     * @param {PaymentInsertDetails} payment payment object
     * @returns {HTTPResponse} Returns success feedback
     */
    public create (payment: PaymentInsertDetails) {
        try {
            //do logic here

            return new HTTPResponseHandler().handleSuccess('Successful payment insert.', null);
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed to insert payment', error);
        }
    }
}