export interface IPaymentInsertDetails {
    title: string;
    description: string;
    amount: number;
    currency: string;
    startTimestamp: number;
    endTimestamp: number;
    numberOfPayments: number;
    type: number;
    frequency: number;
    networkID: number;
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
    numberOfPayments: number;
    nextPaymentDate: number;
    lastPaymentDate: number;
    type: number;
    frequency: number;
    registerTxHash: string;
    registerTxStatus: number;
    executeTxHash: string;
    executeTxStatus: number;
    pullPaymentAccountAddress: string;
    merchantAddress: string;
    userId: string;
    networkID: number;
}