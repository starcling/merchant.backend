import { ISqlQuery, DataService } from '../../utils/datasource/DataService';

export class DashboardDbConnector {

    // Retrieve a merchant address
    public getMerchantAddress() {
        const sqlQuery: ISqlQuery = {
            text: `select distinct tb_payments."merchantAddress" from public.tb_payments;`
        };
        return new DataService().executeQueryAsPromise(sqlQuery);
    }

    // Retrieve a transaction hash using pullpaymentModelid
    public getAllTransact() {
        const sqlQuery: ISqlQuery = {
            text: `SELECT
            pmt."pullPaymentModelID",
            bct.hash,
            pms.title
            FROM
            public.tb_payments as pmt,
            public.tb_blockchain_transactions as bct,
            public.tb_payment_models as pms
            WHERE
            pmt."id" = bct."paymentID" and
            pms."id"=pmt."pullPaymentModelID" and
            bct."typeID" IN(2,3);`
        };
        return new DataService().executeQueryAsPromise(sqlQuery);
    }
    // Retrieve a transaction hash using billingmodelId for a particular billing model
    public getAllTransactionOverView(billmodelId: any) {
        const sqlQuery: ISqlQuery = {
            text: `SELECT
        pmt."pullPaymentModelID",
        bct.hash,
        pms."typeID",
        pms."id",
        pms.title
        FROM
        public.tb_payments as pmt,
        public.tb_blockchain_transactions as bct,
        public.tb_payment_models as pms
        WHERE
        pmt."id" = bct."paymentID" and
        pms."id"=pmt."pullPaymentModelID" and
        pms."id"='` + billmodelId + `';`
        };
        return new DataService().executeQueryAsPromise(sqlQuery);
    }
}