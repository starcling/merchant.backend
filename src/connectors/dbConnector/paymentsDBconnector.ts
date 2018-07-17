import { ISqlQuery, DataService } from '../../utils/datasource/DataService';
import { IPaymentInsertDetails, IPaymentUpdateDetails } from '../../core/payment/models';

export class PaymentDbConnector {
  public insertPayment (insertDetails: IPaymentInsertDetails) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM fc_create_payment($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      values: [insertDetails.title,
               insertDetails.description,
               insertDetails.status,
               insertDetails.amount,
               insertDetails.currency,
               insertDetails.startts,
               insertDetails.endts,
               insertDetails.type,
               insertDetails.frequency]
    };

    return new DataService().executeQueryAsPromise(sqlQuery, true);
  }

  public updatePayment(updateDetails: IPaymentUpdateDetails) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM fc_update_payment($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
      values: [updateDetails.id,
               updateDetails.title,
               updateDetails.description,
               updateDetails.promo,
               updateDetails.status,
               updateDetails.customerAddress,
               updateDetails.amount,
               updateDetails.currency,
               updateDetails.startts,
               updateDetails.endts,
               updateDetails.type,
               updateDetails.frequency,
               updateDetails.transactionHash,
               updateDetails.debitAccount]
    };

    return new DataService().executeQueryAsPromise(sqlQuery);
  }
}