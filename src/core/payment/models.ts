export interface IPaymentInsertDetails {
    title: string;
    description: string;
    amount: number;
    currency: string;
    startTimestamp: number;
    endTimestamp: number;
    limit: number;
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
    limit: number;
    nextPaymentDate: number;
    lastPaymentDate: number;
    type: number;
    frequency: number;
    registerTxHash: string;
    registerTxStatus: number;
    executeTxHash: string;
    executeTxStatus: number;
    debitAccount: string;
    merchantAddress: string;
    userId: string;
}