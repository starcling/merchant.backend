import { IPaymentContractInsert, IPaymentContractUpdate } from '../../core/contract/models';
import { ISqlQuery, DataService } from '../../utils/datasource/DataService';

export class ContractDbConnector {
  public createContract(insertDetails: IPaymentContractInsert) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM fc_create_payment_contract($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      values: [
        insertDetails.hdWalletIndex,
        insertDetails.paymentID,
        insertDetails.numberOfPayments,
        insertDetails.nextPaymentDate,
        insertDetails.lastPaymentDate,
        insertDetails.startTimestamp,
        insertDetails.customerAddress,
        insertDetails.merchantAddress,
        insertDetails.pullPaymentAddress,
        insertDetails.statusID,
        insertDetails.userID
      ]
    };

    return new DataService().executeQueryAsPromise(sqlQuery, true);
  }

  public async updateContract(updateDetails: IPaymentContractUpdate) {
    const sqlQuery: ISqlQuery = {
      // tslint:disable-next-line:max-line-length
      text: 'SELECT * FROM fc_update_payment_contract($1, $2, $3, $4, $5, $6, $7, $8)',
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

  public getContract(contractID: string) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM public.fc_get_payment_contract($1);',
      values: [contractID]
    };

    return new DataService().executeQueryAsPromise(sqlQuery);
  }

  public getAllContracts() {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM public.fc_get_payment_contracts();'
    };

    return new DataService().executeQueryAsPromise(sqlQuery);
  }

  public deleteContract(contractID: string) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM public.fc_delete_payment_contract($1);',
      values: [contractID]
    };

    return new DataService().executeQueryAsPromise(sqlQuery);
  }
}