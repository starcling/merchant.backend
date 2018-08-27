import { IPaymentInsertDetails, IPaymentUpdateDetails } from '../../core/payment/models';
import { ISqlQuery, DataService } from '../../utils/datasource/DataService';

export class PaymentDbConnector {
  public createPayment(insertDetails: IPaymentInsertDetails) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM fc_create_payment($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      values: [
        insertDetails.title,
        insertDetails.description,
        insertDetails.promo,
        insertDetails.amount,
        insertDetails.initialPaymentAmount,
        insertDetails.currency,
        insertDetails.numberOfPayments,
        insertDetails.frequency,
        insertDetails.typeID,
        insertDetails.networkID
      ]
    };

    return new DataService().executeQueryAsPromise(sqlQuery, true);
  }

  public async updatePayment(updateDetails: IPaymentUpdateDetails) {
    const sqlQuery: ISqlQuery = {
      // tslint:disable-next-line:max-line-length
      text: 'SELECT * FROM fc_update_payment($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
      values: [
        updateDetails.id,
        updateDetails.title,
        updateDetails.description,
        updateDetails.promo,
        updateDetails.amount,
        updateDetails.initialPaymentAmount,
        updateDetails.currency,
        updateDetails.numberOfPayments,
        updateDetails.frequency,
        updateDetails.typeID,
        updateDetails.userID,
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