import { IPaymentModelInsertDetails, IPaymentModelUpdateDetails } from '../../core/paymentModel/models';
import { ISqlQuery, DataService } from '../../utils/datasource/DataService';

export class PaymentModelDbConnector {
  public createPaymentModel(insertDetails: IPaymentModelInsertDetails) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM fc_create_payment_model($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
      values: [
        insertDetails.merchantID,
        insertDetails.title,
        insertDetails.description,
        insertDetails.amount,
        insertDetails.initialPaymentAmount,
        insertDetails.trialPeriod,
        insertDetails.currency,
        insertDetails.numberOfPayments,
        insertDetails.frequency,
        insertDetails.typeID,
        insertDetails.networkID,
        insertDetails.automatedCashOut,
        insertDetails.cashOutFrequency
      ]
    };

    return new DataService().executeQueryAsPromise(sqlQuery, true);
  }

  public async updatePaymentModel(updateDetails: IPaymentModelUpdateDetails) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM fc_update_payment_model($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
      values: [
        updateDetails.id,
        updateDetails.title,
        updateDetails.description,
        updateDetails.amount,
        updateDetails.initialPaymentAmount,
        updateDetails.trialPeriod,
        updateDetails.currency,
        updateDetails.numberOfPayments,
        updateDetails.frequency,
        updateDetails.typeID,
        updateDetails.networkID,
        updateDetails.automatedCashOut,
        updateDetails.cashOutFrequency
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

  public getPaymentModelByID(paymentID: string) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM public.fc_get_payment_model_by_id($1);',
      values: [paymentID]
    };

    return new DataService().executeQueryAsPromise(sqlQuery);
  }

  public getAllPaymentModels() {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM public.fc_get_all_payment_models();'
    };

    return new DataService().executeQueryAsPromise(sqlQuery);
  }

  public deletePaymentModel(paymentId: string) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM public.fc_delete_payment_model($1);',
      values: [paymentId]
    };

    return new DataService().executeQueryAsPromise(sqlQuery);
  }
}