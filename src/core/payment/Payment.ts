import { IPaymentInsertDetails } from './models';
import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';

export class Payment {

    /**
     * @description Create method for inserting payment into DB
     * @param {IPaymentInsertDetails} payment payment object
     * @returns {HTTPResponse} Returns success feedback
     */
    public create (payment: IPaymentInsertDetails) {
        try {
            //do logic here

            return new HTTPResponseHandler().handleSuccess('Successful payment insert.', null);
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed to insert payment', error);
        }
    }

     /**
     * @description Get method for getting single payment from DB
     * @param {string} paymentID ID of the payment
     * @returns {HTTPResponse} Returns response with payment object in data
     */
    public getPayment (paymentID: string) {
        try {

            return new HTTPResponseHandler().handleSuccess('Successfully retrieved single payment.', null);
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed to retrieve single payment.', error);
        }
    }

     /**
     * @description Get method for getting single payment from DB
     * @returns {HTTPResponse} Returns response with array of payments in data
     */
    public getPayments () {
        try {

            return new HTTPResponseHandler().handleSuccess('Successfully retrieved payments.', null);
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed to retrieve payments.', error);
        }
    }
}