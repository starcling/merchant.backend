import { ISqlQuery, DataService } from '../../utils/datasource/DataService';

export class instertPayment {
  public updateOnFailLogin(insertdetails: PaymentInsertDetails) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM fc_create_payment($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      values: [insertdetails.title, insertdetails.description, insertdetails.status, insertdetails.amount, insertdetails.currency,
            insertdetails.startts, insertdetails.endts, insertdetails.type, insertdetails.frequency]
    };

    return new DataService().executeQueryAsPromise(sqlQuery);
  }

  public updatePayment(updatedetails: PaymentPatchDetails) {
    const sqlQuery: ISqlQuery = {
      text: 'SELECT * FROM fc_patch_payment($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
      values: [updatedetails.id, updatedetails.title, updatedetails.description, updatedetails.promo, updatedetails.status, updatedetails.customerAddress,
        updatedetails.amount, updatedetails.currency, updatedetails.startts, updatedetails.endts, updatedetails.type, updatedetails.frequency,
        updatedetails.transactionHash, updatedetails.debitAccount]
    };

    return new DataService().executeQueryAsPromise(sqlQuery);
  }
}

export interface PaymentInsertDetails {
    title: string;
    description: string;
    status: number;
    amount: number;
    currency: string;
    startts: number;
    endts: number;
    type: number;
    frequency: number;
}

export interface PaymentPatchDetails {
    id: string;
    title: string;
    description: string;
    promo: string;
    status: number;
    customerAddress: string;
    amount: number;
    currency: string;
    startts: number;
    endts: number;
    type: number;
    frequency: number;
    transactionHash: string;
    debitAccount: string;
}