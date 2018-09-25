import { ISqlQuery, DataService } from '../../utils/datasource/DataService';
import { Globals } from '../../utils/globals';

export class EnumDbConnector {
    public getPaymentStatuses() {
        const sqlQuery: ISqlQuery = {
            text: 'SELECT * FROM public.fc_get_enums($1);',
            values: [Globals.GET_ENUM_TABLE_NAMES().paymentStatus]
        };

        return new DataService().executeQueryAsPromise(sqlQuery);
    }

    public getPaymentModelTypes() {
        const sqlQuery: ISqlQuery = {
            text: 'SELECT * FROM public.fc_get_enums($1);',
            values: [Globals.GET_ENUM_TABLE_NAMES().paymentModelType]
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