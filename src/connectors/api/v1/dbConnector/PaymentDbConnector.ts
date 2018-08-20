import { IPaymentInsertDetails, IPaymentUpdateDetails } from '../../../../core/payment/models';
import { ISqlQuery, DataService } from '../../../../utils/datasource/DataService';

export class PaymentDbConnector {
  public createPayment(insertDetails: IPaymentInsertDetails) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM fc_create_payment($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
      values: [
        insertDetails.title,
        insertDetails.description,
        insertDetails.amount,
        insertDetails.currency,
        insertDetails.startTimestamp,
        insertDetails.endTimestamp,
        insertDetails.numberOfPayments,
        insertDetails.startTimestamp,
        insertDetails.type,
        insertDetails.frequency,
        insertDetails.merchantAddress,
        insertDetails.networkID
      ]
    };

    return new DataService().executeQueryAsPromise(sqlQuery, true);
  }

  public async updatePayment(updateDetails: IPaymentUpdateDetails) {
    const sqlQuery: ISqlQuery = {
      // tslint:disable-next-line:max-line-length
      text: 'SELECT * FROM fc_update_payment($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)',
      values: [
        updateDetails.id,
        updateDetails.title,
        updateDetails.description,
        updateDetails.promo,
        updateDetails.status,
        updateDetails.customerAddress,
        updateDetails.amount,
        updateDetails.currency,
        updateDetails.startTimestamp,
        updateDetails.endTimestamp,
        updateDetails.numberOfPayments,
        updateDetails.nextPaymentDate,
        updateDetails.lastPaymentDate,
        updateDetails.type,
        updateDetails.frequency,
        updateDetails.registerTxHash,
        updateDetails.registerTxStatus,
        updateDetails.executeTxHash,
        updateDetails.executeTxStatus,
        updateDetails.cancelTxHash,
        updateDetails.cancelTxStatus,
        updateDetails.merchantAddress,
        updateDetails.pullPaymentAddress,
        updateDetails.userId,
        updateDetails.networkID
      ]
    };
    // Handling the case when no record exists with provided id
    const response = await new DataService().executeQueryAsPromise(sqlQuery);
    if (response.data.length === 0 || !response.data[0].id) {
      response.success = false;
      response.status = 400;
      response.message = 'No record found with provided id.';
    }

    return response;
  }

  public getPayment(paymentID: string) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM public.fc_get_payment_details($1);',
      values: [paymentID]
    };

    return new DataService().executeQueryAsPromise(sqlQuery);
  }

  public getAllPayments() {
    const sqlQuery: ISqlQuery = {
        text: 'SELECT * FROM public.fc_get_all_payment_details();'
    };

    return new DataService().executeQueryAsPromise(sqlQuery);
  }

  public deletePayment(paymentId: string) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM public.fc_delete_payment($1);',
      values: [paymentId]
    };

    return new DataService().executeQueryAsPromise(sqlQuery);
  }
}