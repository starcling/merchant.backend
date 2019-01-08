import { ISqlQuery, DataService } from '../../utils/datasource/DataService';

export class DashboardDbConnector {
    public getTransactionHistory() {
        const
            sqlQuery: ISqlQuery = {
                text:
                    'SELECT * FROM public.fc_get_transactionhistory();'
            };
        return new DataService().executeQueryAsPromise(sqlQuery);
    }

    public getTranasctionOverview(id: string) {
        const sqlQuery: ISqlQuery = {
            text:
                'SELECT * FROM public.fc_get_transactionOverview($1);',
            values: [id]
        };
        return new DataService().executeQueryAsPromise(sqlQuery);
    }

    public getMerchantAddress() {
        const sqlQuery: ISqlQuery = {
            text:
                'SELECT * FROM public.fc_get_merchantaddress();'
        };
        return new DataService().executeQueryAsPromise(sqlQuery);
    }
}