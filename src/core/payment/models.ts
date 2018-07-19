export interface IPaymentInsertDetails {
    title: string;
    description: string;
    status: number;
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
    type: number;
    frequency: number;
    transactionHash: string;
    debitAccount: string;
}