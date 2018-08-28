import { ISqlQuery, DataService } from '../../utils/datasource/DataService';
import { Globals } from '../../utils/globals';

export class EnumDbConnector {
    public getContractStatuses() {
        const sqlQuery: ISqlQuery = {
            text: 'SELECT * FROM public.fc_get_enums($1);',
            values: [Globals.GET_ENUM_TABLE_NAMES().contractStatus]
        };

        return new DataService().executeQueryAsPromise(sqlQuery);
    }

    public getPaymentTypes() {
        const sqlQuery: ISqlQuery = {
            text: 'SELECT * FROM public.fc_get_enums($1);',
            values: [Globals.GET_ENUM_TABLE_NAMES().paymentType]
        };

        return new DataService().executeQueryAsPromise(sqlQuery);
    }

    public getTransactionStatuses() {
        const sqlQuery: ISqlQuery = {
            text: 'SELECT * FROM public.fc_get_enums($1);',
            values: [Globals.GET_ENUM_TABLE_NAMES().transactionStatus]
        };

        return new DataService().executeQueryAsPromise(sqlQuery);
    }

    public getTransactionTypes() {
        const sqlQuery: ISqlQuery = {
            text: 'SELECT * FROM public.fc_get_enums($1);',
            values: [Globals.GET_ENUM_TABLE_NAMES().transactionType]
        };

        return new DataService().executeQueryAsPromise(sqlQuery);
    }
}