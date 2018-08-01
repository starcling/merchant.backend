export interface IPaymentInsertDetails {
    title: string;
    description: string;
    amount: number;
    currency: string;
    startTimestamp: number;
    endTimestamp: number;
    type: number;
    frequency: number;
}

export interface IPaymentUpdateDetails {
    id: string;
    title: string;
    description: string;
    promo: string;
    status: number;
    customerAddress: string;
    amount: number;
    currency: string;
    startTimestamp: number;
    endTimestamp: number;
    nextPaymentDate: number;
    lastPaymentDate: number;
    type: number;
    frequency: number;
    registerTxHash: string;
    executeTxHash: string;
    executeTxStatus: number;
    debitAccount: string;
    merchantAddress: string;
}