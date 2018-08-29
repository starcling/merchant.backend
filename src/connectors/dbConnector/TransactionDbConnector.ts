import { ISqlQuery, DataService } from '../../utils/datasource/DataService';
import { ITransactionInsert, ITransactionUpdate, ITransactionGet } from '../../core/transaction/models';

export class TransactionDbConnector {
    public createTransaction(transaction: ITransactionInsert) {
        const sqlQuery: ISqlQuery = {
            text: 'SELECT * FROM public.fc_create_transaction($1, $2, $3, $4, $5);',
            values: [
                transaction.hash,
                transaction.statusID,
                transaction.typeID,
                transaction.contractID,
                transaction.timestamp
            ]
        };

        return new DataService().executeQueryAsPromise(sqlQuery, true);
    }

    public updateTransaction(transaction: ITransactionUpdate) {
        const sqlQuery: ISqlQuery = {
            text: 'SELECT * FROM public.fc_update_transaction($1, $2);',
            values: [
                transaction.hash,
                transaction.statusID
            ]
        };

        return new DataService().executeQueryAsPromise(sqlQuery);
    }

    public deleteTransaction(transaction: ITransactionGet) {
        const sqlQuery: ISqlQuery = {
            text: 'SELECT * FROM public.fc_delete_transaction($1);',
            values: [
                transaction.hash
            ]
        };

        return new DataService().executeQueryAsPromise(sqlQuery);
    }

    public getTransaction(transaction: ITransactionGet) {
        const sqlQuery: ISqlQuery = {
            text: 'SELECT * FROM public.fc_get_transaction($1);',
            values: [
                transaction.hash
            ]
        };

        return new DataService().executeQueryAsPromise(sqlQuery);
    }

    public getTransactionsByContractID(transaction: ITransactionGet) {
        const sqlQuery: ISqlQuery = {
            text: 'SELECT * FROM public.fc_get_transactions_by_contract_id($1, $2, $3);',
            values: [
                transaction.contractID,
                transaction.statusID,
                transaction.typeID
            ]
        };

        return new DataService().executeQueryAsPromise(sqlQuery);
    }

}