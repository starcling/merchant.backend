import { IPaymentInsert, IPaymentUpdate } from './models';
import { PaymentDbConnector } from '../../connectors/dbConnector/PaymentDbConnector';
import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { HTTPResponseCodes } from '../../utils/web/HTTPResponseCodes';
import { HTTPRequestFactory } from '../../utils/web/HTTPRequestFactory';
import { PaymentModelDbConnector } from '../../connectors/dbConnector/PaymentModelDbConnector';
import { IPaymentModelUpdateDetails } from '../paymentModel/models';
import { Globals } from '../../utils/globals';
import { NewPaymentModelHdWalletDetails, CreatePaymentModelHandler } from '../paymentModel/CreatePaymentModelHandler';

export class Payment {
    /**
     * @description Create method for inserting payment into DB
     * @param {IPaymentInsert} payment payment object
     * @returns {HTTPResponse} Returns success feedback
     */
    public async createPayment(payment: IPaymentInsert) {
        const dbConnector = new PaymentDbConnector();
        const paymentModelResult = await new PaymentModelDbConnector().getPaymentModelByID(payment.pullPaymentModelID);
        const paymentModel: IPaymentModelUpdateDetails = paymentModelResult.data[0];
        let result;
        try {
            const paymentCountResult = await dbConnector.getPaymentCountByCustomerAndPaymentModelID(
                payment.customerAddress, payment.pullPaymentModelID);
            const paymentCcount = Number(paymentCountResult.data[0]['fn_get_payment_count_by_customer_and_payment_model_id']);
            if (paymentCcount === 0) {
                const walletDetails : NewPaymentModelHdWalletDetails = await new CreatePaymentModelHandler().handle();
                if (!walletDetails.index && !walletDetails.address) {
                    return new HTTPResponseHandler().handleFailed(
                        'Failed to insert paymentModel.',
                        'Check the mnemonic ID.', HTTPResponseCodes.BAD_REQUEST());
                }

                payment.hdWalletIndex = walletDetails.index;
                payment.merchantAddress = walletDetails.address;

                payment.startTimestamp = Number(payment.startTimestamp);

                if (paymentModel.trialPeriod > 0) {
                    payment.startTimestamp += Number(paymentModel.trialPeriod);
                }

                if (paymentModel.typeID === Globals.GET_PAYMENT_TYPE_ENUM()[Globals.GET_PAYMENT_TYPE_ENUM_NAMES().recurringWithInitial]) {
                    payment.startTimestamp += paymentModel.frequency;
                }

                payment.numberOfPayments = paymentModel.numberOfPayments;
                payment.nextPaymentDate = payment.startTimestamp;
                payment.userID = payment.userID ? payment.userID : '0';

                result = await dbConnector.createPayment(payment);
            } else {
                result = await dbConnector.getPaymentByCustomerAndPaymentModelID(payment.customerAddress, payment.pullPaymentModelID);

                if (result.data[0].statusID === Globals.GET_PAYMENT_STATUS_ENUM_NAMES().cancelled ||
                    result.data[0].statusID === Globals.GET_PAYMENT_STATUS_ENUM_NAMES().done) {
                    const updatePayload = <IPaymentUpdate>{ ...result.data[0] };

                    updatePayload.startTimestamp = Number(payment.startTimestamp);

                    if (result.data[0].trialPeriod > 0) {
                        updatePayload.startTimestamp += Number(result.data[0].trialPeriod);
                    }

                    if (result.data[0].typeID ===
                        Globals.GET_PAYMENT_TYPE_ENUM()[Globals.GET_PAYMENT_TYPE_ENUM_NAMES().recurringWithInitial]) {
                        updatePayload.startTimestamp += result.data[0].frequency;
                    }

                    updatePayload.nextPaymentDate = updatePayload.startTimestamp;
                    updatePayload.numberOfPayments = payment.numberOfPayments;
                    updatePayload.statusID = Globals.GET_PAYMENT_STATUS_ENUM_NAMES().initial;
                    updatePayload.userID = payment.userID ? payment.userID : '0';

                    result = await dbConnector.updatePayment(updatePayload);
                }
            }

            return new HTTPResponseHandler().handleSuccess('Successful payment inserted.', result.data[0]);
        } catch (error) {
            console.debug(error);
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to insert payment', error);
        }
    }

    /**
     * @description Get method for updating payment from DB
     * @param {IPaymentUpdate} payment the updated payment object
     * @returns {HTTPResponse} Returns response with payment object in data
     */
    public async updatePayment(payment: IPaymentUpdate) {
        try {
            const response = await new PaymentDbConnector().updatePayment(payment);
            if (response.data[0].id === null) {

                return new HTTPResponseHandler().handleFailed('Payment with supplied ID not found.', {}, HTTPResponseCodes.BAD_REQUEST());
            }
            try {
                const httpRequest = new HTTPRequestFactory()
                    .create(`${process.env.API_URL}/api/v1/merchant/${response.data[0].merchantID}`, {
                        'Content-Type': 'application/json'
                    }, 'GET', null, null);
                const httpResponse = await httpRequest.getResponse();
                response.data[0].merchantName = JSON.parse(httpResponse.body).data.businessName;
            } catch (err) {
                console.log(err);
            }

            return new HTTPResponseHandler().handleSuccess('Successfully updated single payment.', response.data[0]);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to update single payment.', error);
        }
    }

    /**
     * @description Get method for getting single payment from DB
     * @param {string} paymentID ID of the payment
     * @returns {HTTPResponse} Returns response with payment object in data
     */
    public async getPaymentByID(paymentID: string) {
        try {
            const response = await new PaymentDbConnector().getPaymentByID(paymentID);
            if (response.data && response.data[0] && response.data[0].id !== null) {
                return new HTTPResponseHandler().handleSuccess(`Successfully retrieved payment with ID: ${paymentID}.`,
                    response.data[0]);
            }

            return new HTTPResponseHandler().handleFailed('Payment with supplied ID not found.',
                null, HTTPResponseCodes.BAD_REQUEST());
        } catch (error) {
            console.debug(error);
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed(`Failed to retrieve payment with ID: ${paymentID}.`, error);
        }
    }

    /**
     * @description Get method for getting all contracts from DB
     * @returns {HTTPResponse} Returns response with array of contracts in data
     */
    public async getAllPayments() {
        try {
            const response = await new PaymentDbConnector().getAllPayments();
            if (!response.data) {
                response.data = [];
            }

            return new HTTPResponseHandler().handleSuccess('Successfully retrieved all payments.', response.data);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to retrieve all payments.', error);
        }
    }

    /**
     * @description Delete method for removing a payment from DB
     * @param {string} paymentID ID of the payment
     * @returns {HTTPResponse} Returns success feedback
     */
    public async deletePaymentByID(paymentID: string) {
        try {
            const response = await new PaymentDbConnector().deletePayment(paymentID);
            if (response.data[0].fc_delete_payment) {
                return new HTTPResponseHandler().handleSuccess('Successfully deleted payment.', {});
            }

            return new HTTPResponseHandler().handleFailed('No payment with given ID.', {}, HTTPResponseCodes.BAD_REQUEST());

        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to delete single payment.', error);
        }
    }
}