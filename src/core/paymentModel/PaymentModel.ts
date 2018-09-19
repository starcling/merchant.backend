import { IPaymentModelInsertDetails, IPaymentModelUpdateDetails } from './models';
import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { HTTPResponseCodes } from '../../utils/web/HTTPResponseCodes';
import { PaymentModelDbConnector } from '../../connectors/dbConnector/PaymentModelDbConnector';

export class PaymentModel {
    /**
     * @description Create method for inserting paymentModel model into DB
     * @param {IPaymentModelInsertDetails} paymentModel paymentModel model object
     * @returns {HTTPResponse} Returns success feedback
     */
    public async createPaymentModel(paymentModel: IPaymentModelInsertDetails) {
        try {
            const result = await new PaymentModelDbConnector().createPaymentModel(paymentModel);

            return new HTTPResponseHandler().handleSuccess('Successful payment model inserted.', result.data[0]);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to insert payment model.', error);
        }
    }

    /**
     * @description Get method for getting single paymentModel model from DB
     * @param {string} paymentModelID ID of the paymentModel model
     * @returns {HTTPResponse} Returns response with paymentModel model object in data
     */
    public async getPaymentModelByID(paymentModelID: string) {
        try {
            const response = await new PaymentModelDbConnector().getPaymentModelByID(paymentModelID);
            if (response.data[0].id === null) {

                return new HTTPResponseHandler().handleFailed('Payment Model with supplied ID not found.',
                    null, HTTPResponseCodes.BAD_REQUEST());
            }

            return new HTTPResponseHandler().handleSuccess(
                `Successfully retrieved payment model with ID: ${paymentModelID}`, response.data[0]);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to retrieve single paymentModel.', error);
        }
    }

    /**
     * @description Delete method for removing a paymentModel model from DB
     * @param {string} paymentModelID ID of the paymentModel model
     * @returns {HTTPResponse} Returns success feedback
     */
    public async deletePaymentModel(paymentModelID: string) {
        try {
            const response = await new PaymentModelDbConnector().deletePaymentModel(paymentModelID);
            if (response.data[0].fc_delete_payment_model) {
                return new HTTPResponseHandler().handleSuccess(
                    `Successfully deleted payment model with ID: ${paymentModelID}`, {});
            }

            return new HTTPResponseHandler().handleFailed(
                `No payment model with ID: ${paymentModelID}`, {}, HTTPResponseCodes.BAD_REQUEST());

        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to delete paymentModel model.', error);
        }
    }

    /**
     * @description Get method for getting all paymentModel models from DB
     * @returns {HTTPResponse} Returns response with array of paymentModel models in data
     */
    public async getAllPaymentModels() {
        try {
            const response = await new PaymentModelDbConnector().getAllPaymentModels();
            if (!response.data) {
                response.data = [];
            }

            return new HTTPResponseHandler().handleSuccess('Successfully retrieved paymentModel models.', response.data);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to retrieve paymentModel models.', error);
        }
    }

    /**
     * @description Create method for updating a paymentModel model in DB
     * @param {IPaymentModelUpdateDetails} paymentModel paymentModel model object
     * @returns {HTTPResponse} Returns success feedback
     */
    public async updatePaymentModel(paymentModel: IPaymentModelUpdateDetails) {
        try {
            const response = await new PaymentModelDbConnector().updatePaymentModel(paymentModel);

            return new HTTPResponseHandler().handleSuccess('Successful payment model updated.', response.data[0]);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to update payment model mode.', error);
        }
    }
}