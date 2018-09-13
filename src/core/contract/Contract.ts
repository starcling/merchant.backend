import { IPaymentContractInsert, IPaymentContractUpdate } from './models';
import { ContractDbConnector } from '../../connectors/dbConnector/ContractDbConnector';
import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { HTTPResponseCodes } from '../../utils/web/HTTPResponseCodes';
import { PaymentDbConnector } from '../../connectors/dbConnector/PaymentDbConnector';
import { IPaymentUpdateDetails } from '../payment/models';
import { Globals } from '../../utils/globals';
import { NewPaymentHdWalletDetails, CreatePaymentHandler } from '../payment/CreatePaymentHandler';

export class Contract {
    /**
     * @description Create method for inserting contract into DB
     * @param {IPaymentContractInsert} contract contract object
     * @returns {HTTPResponse} Returns success feedback
     */
    public async createContract(contract: IPaymentContractInsert) {
        const dbConnector = new ContractDbConnector();
        const paymentResult = await new PaymentDbConnector().getPayment(contract.paymentID);
        const payment: IPaymentUpdateDetails = paymentResult.data[0];
        let result;
        try {
            const contractCountResult = await dbConnector.getContractCountByCustomerAndPaymentID(
                contract.customerAddress, contract.paymentID);
            const contractcount = Number(contractCountResult.data[0]['fn_get_contract_count_by_customer_and_payment_id']);
            if (contractcount === 0) {
                const walletDetails: NewPaymentHdWalletDetails = await new CreatePaymentHandler().handle();
                if (!walletDetails.index && !walletDetails.address) {
                    return new HTTPResponseHandler().handleFailed(
                        'Failed to insert payment.',
                        'Check the mnemonic ID.', HTTPResponseCodes.BAD_REQUEST());
                }

                contract.hdWalletIndex = walletDetails.index;
                contract.merchantAddress = walletDetails.address;

                contract.startTimestamp = Number(contract.startTimestamp);

                if (payment.trialPeriod > 0) {
                    contract.startTimestamp += Number(payment.trialPeriod);
                }

                if (payment.typeID === Globals.GET_PAYMENT_TYPE_ENUM()[Globals.GET_PAYMENT_TYPE_ENUM_NAMES().recurringWithInitial]) {
                    contract.startTimestamp += payment.frequency;
                }

                contract.nextPaymentDate = contract.startTimestamp;
                contract.userID = '0'; // TODO: insert user id based on customerAddress on merchants DB

                result = await dbConnector.createContract(contract);
            } else {
                result = await dbConnector.getContractByCustomerAndPaymentID(contract.customerAddress, contract.paymentID);
                if (result.data[0].statusID === Globals.GET_PAYMENT_STATUS_ENUM_NAMES().cancelled ||
                    result.data[0].statusID === Globals.GET_PAYMENT_STATUS_ENUM_NAMES().done) {
                    const updatePayload = <IPaymentContractUpdate>{ ...result.data[0] };
                    updatePayload.startTimestamp = Number(contract.startTimestamp);

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
                    updatePayload.userID = '0'; // TODO: insert user id based on customerAddress on merchants DB

                    result = await dbConnector.updateContract(updatePayload);
                }
            }

            return new HTTPResponseHandler().handleSuccess('Successful contract insert.', result.data[0]);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to insert contract', error);
        }
    }

    /**
     * @description Get method for updating single contract from DB
     * @param {IPaymentContractUpdate} contract ID of the contract
     * @returns {HTTPResponse} Returns response with contract object in data
     */
    public async updateContract(contract: IPaymentContractUpdate) {
        try {
            const response = await new ContractDbConnector().updateContract(contract);
            if (response.data[0].id === null) {

                return new HTTPResponseHandler().handleFailed('Contract with supplied ID not found.', {}, HTTPResponseCodes.BAD_REQUEST());
            }

            return new HTTPResponseHandler().handleSuccess('Successfully updated single contract.', response.data[0]);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to update single contract.', error);
        }
    }

    /**
     * @description Get method for getting single contract from DB
     * @param {string} contractID ID of the contract
     * @returns {HTTPResponse} Returns response with contract object in data
     */
    public async getContract(contractID: string) {
        try {
            const response = await new ContractDbConnector().getContract(contractID);
            if (response.data[0].id === null) {

                return new HTTPResponseHandler().handleFailed('Contract with supplied ID not found.', {}, HTTPResponseCodes.BAD_REQUEST());
            }

            return new HTTPResponseHandler().handleSuccess('Successfully retrieved single contract.', response.data[0]);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to retrieve single contract.', error);
        }
    }

    /**
     * @description Get method for getting all contracts from DB
     * @returns {HTTPResponse} Returns response with array of contracts in data
     */
    public async getAllContracts() {
        try {
            const response = await new ContractDbConnector().getAllContracts();
            if (!response.data) {
                response.data = [];
            }

            return new HTTPResponseHandler().handleSuccess('Successfully retrieved contracts.', response.data);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to retrieve contracts.', error);
        }
    }

    /**
     * @description Delete method for removing a contract from DB
     * @param {string} contractID ID of the contract
     * @returns {HTTPResponse} Returns success feedback
     */
    public async deleteContract(contractID: string) {
        try {
            const response = await new ContractDbConnector().deleteContract(contractID);
            if (response.data[0].fc_delete_payment_contract) {

                return new HTTPResponseHandler().handleSuccess('Successfully deleted single contract.', {});
            }

            return new HTTPResponseHandler().handleFailed('No contract with given ID.', {}, HTTPResponseCodes.BAD_REQUEST());

        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to delete single contract.', error);
        }
    }

}