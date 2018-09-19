import { IPaymentInsert, IPaymentUpdate } from '../../core/payment/models';
import { ISqlQuery, DataService } from '../../utils/datasource/DataService';

export class PaymentDbConnector {
  public createPayment(insertDetails: IPaymentInsert) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM fc_create_payment($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      values: [
        insertDetails.hdWalletIndex,
        insertDetails.paymentModelID,
        insertDetails.numberOfPayments,
        insertDetails.nextPaymentDate,
        insertDetails.startTimestamp,
        insertDetails.customerAddress,
        insertDetails.merchantAddress,
        insertDetails.pullPaymentAddress,
        insertDetails.userID
      ]
    };

    return new DataService().executeQueryAsPromise(sqlQuery, true);
  }

  public async updatePayment(updateDetails: IPaymentUpdate) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM fc_update_payment($1, $2, $3, $4, $5, $6, $7, $8)',
      values: [
        updateDetails.id,
        updateDetails.hdWalletIndex,
        updateDetails.numberOfPayments,
        updateDetails.nextPaymentDate,
        updateDetails.lastPaymentDate,
        updateDetails.startTimestamp,
        updateDetails.statusID,
        updateDetails.userID
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

  public getPaymentByID(paymentID: string) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM public.fc_get_payment_by_id($1);',
      values: [paymentID]
    };

    return new DataService().executeQueryAsPromise(sqlQuery);
  }

  public getAllPayments() {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM public.fc_get_payment_by_ids();'
    };

    return new DataService().executeQueryAsPromise(sqlQuery);
  }

  public deletePayment(paymentID: string) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM public.fc_delete_payment($1);',
      values: [paymentID]
    };

    return new DataService().executeQueryAsPromise(sqlQuery);
  }

  public getPaymentCountByCustomerAndPaymentModelID(customerAddress: string, paymentModelID: string): Promise<any> {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM public.fn_get_payment_count_by_customer_and_payment_model_id($1, $2);',
      values: [customerAddress, paymentModelID]
    };

    return new DataService().executeQueryAsPromise(sqlQuery);
  }

  public getPaymentByCustomerAndPaymentModelID(customerAddress: string, paymentModelID: string): Promise<any> {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM public.fn_get_payment_by_customer_and_payment_model_id($1, $2);',
      values: [customerAddress, paymentModelID]
    };

    return new DataService().executeQueryAsPromise(sqlQuery);
  }
}