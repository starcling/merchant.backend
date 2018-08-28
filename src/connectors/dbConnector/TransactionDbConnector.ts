import { ISqlQuery, DataService } from '../../utils/datasource/DataService';
import { ITransactionInsert } from '../../core/transaction/models';

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

}