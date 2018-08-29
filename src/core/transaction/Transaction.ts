import { TransactionDbConnector } from '../../connectors/dbConnector/TransactionDbConnector';
import { ITransactionInsert, ITransactionGet } from './models';
import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { HTTPResponseCodes } from '../../utils/web/HTTPResponseCodes';

export class Transaction {
    /**
     * @description Create method for inserting transaction into DB
     * @param {ITransactionInsert} transaction transaction object
     * @returns {HTTPResponse} Returns success feedback
     */
    public async createTransaction(transaction: ITransactionInsert) {
        try {
            const result = await new TransactionDbConnector().createTransaction(transaction);

            return new HTTPResponseHandler().handleSuccess('Successful transaction insert.', result.data[0]);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to insert transaction', error);
        }
    }

    /**
     * @description Get method for getting single transaction from DB
     * @param {string} transaction Hash of the transaction
     * @returns {HTTPResponse} Returns response with transaction object in data
     */
    public async getTransaction(transaction: ITransactionGet) {
        try {
            const response = await new TransactionDbConnector().getTransaction(transaction);
            if (response.data[0].id === null) {

                return new HTTPResponseHandler()
                    .handleFailed('Transaction with supplied ID not found.', {}, HTTPResponseCodes.BAD_REQUEST());
            }

            return new HTTPResponseHandler().handleSuccess('Successfully retrieved single transaction.', response.data[0]);
        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to retrieve single transaction.', error);
        }
    }

    /**
     * @description Get method for getting all contracts from DB
     * @returns {HTTPResponse} Returns response with array of contracts in data
     */
    public async getTransactionsByContractID(transaction: ITransactionGet) {
        try {
            const response = await new TransactionDbConnector().getTransactionsByContractID(transaction);
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
     * @description Delete method for removing a transaction from DB
     * @param {string} transaction ID of the transaction
     * @returns {HTTPResponse} Returns success feedback
     */
    public async deleteTransaction(transaction: ITransactionGet) {
        try {
            const response = await new TransactionDbConnector().deleteTransaction(transaction);
            if (response.data[0].fc_delete_transaction) {

                return new HTTPResponseHandler().handleSuccess('Successfully deleted single transaction.', {});
            }

            return new HTTPResponseHandler().handleFailed('No transaction with given ID.', {}, HTTPResponseCodes.BAD_REQUEST());

        } catch (error) {
            if (error.status) {
                return error;
            }

            return new HTTPResponseHandler().handleFailed('Failed to delete single transaction.', error);
        }
    }
}