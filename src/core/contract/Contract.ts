import { IPaymentContractInsert } from './models';
import { ContractDbConnector } from '../../connectors/dbConnector/ContractDbConnector';
import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { HTTPResponseCodes } from '../../utils/web/HTTPResponseCodes';

export class Contract {
    /**
     * @description Create method for inserting contract into DB
     * @param {IPaymentContractInsert} contract contract object
     * @returns {HTTPResponse} Returns success feedback
     */
    public async createContract(contract: IPaymentContractInsert) {
        try {
            const result = await new ContractDbConnector().createContract(contract);

            return new HTTPResponseHandler().handleSuccess('Successful contract insert.', result.data[0]);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to insert contract', error);
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