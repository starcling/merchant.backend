import { IPaymentModelInsertDetails, IPaymentModelUpdateDetails } from './models';
import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { HTTPResponseCodes } from '../../utils/web/HTTPResponseCodes';
import { PaymentModelDbConnector } from '../../connectors/dbConnector/PaymentModelDbConnector';
import { Globals } from '../../utils/globals';

export class PaymentModel {
    /**
     * @description Create method for inserting payment model into DB
     * @param {IPaymentModelInsertDetails} paymentModel payment model object
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
     * @description Get method for getting single payment model from DB
     * @param {string} pullPaymentModelID ID of the payment model
     * @returns {HTTPResponse} Returns response with payment model object in data
     */
    public async getPaymentModelByID(pullPaymentModelID: string) {
        try {
            const response = await new PaymentModelDbConnector().getPaymentModelByID(pullPaymentModelID);
            if (response.data && response.data[0] && response.data[0].id !== null) {
                try {
                    response.data[0].merchantName = Globals.GET_MERCHANT_NAME();
                } catch (err) {
                    console.log(err);
                }

                return new HTTPResponseHandler().handleSuccess(
                    `Successfully retrieved payment model with ID: ${pullPaymentModelID}`, response.data[0]);
            }

            return new HTTPResponseHandler().handleFailed('Payment Model with supplied ID not found.',
                null, HTTPResponseCodes.BAD_REQUEST());
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to retrieve single paymentModel.', error);
        }
    }

    /**
     * @description Delete method for removing a payment model from DB
     * @param {string} pullPaymentModelID ID of the payment model
     * @returns {HTTPResponse} Returns success feedback
     */
    public async deletePaymentModel(pullPaymentModelID: string) {
        try {
            const response = await new PaymentModelDbConnector().deletePaymentModel(pullPaymentModelID);
            if (response.data[0].fc_delete_payment_model) {
                return new HTTPResponseHandler().handleSuccess(
                    `Successfully deleted payment model with ID: ${pullPaymentModelID}`, {});
            }

            return new HTTPResponseHandler().handleFailed(
                `No payment model with ID: ${pullPaymentModelID}`, {}, HTTPResponseCodes.BAD_REQUEST());

        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to delete payment model.', error);
        }
    }

    /**
     * @description Get method for getting all payment models from DB
     * @returns {HTTPResponse} Returns response with array of payment models in data
     */
    public async getAllPaymentModels() {
        try {
            const response = await new PaymentModelDbConnector().getAllPaymentModels();
            if (!response.data) {
                response.data = [];
            }

            return new HTTPResponseHandler().handleSuccess('Successfully retrieved payment models.', response.data);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to retrieve payment models.', error);
        }
    }

    /**
     * @description Create method for updating a payment model in DB
     * @param {IPaymentModelUpdateDetails} paymentModel payment model object
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