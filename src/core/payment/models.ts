export interface IPaymentInsertDetails {
    title: string;
    description: string;
    amount: number;
    initialPaymentAmount: number;
    currency: string;
    startTimestamp: number;
    endTimestamp: number;
    numberOfPayments: number;
    merchantAddress: string;
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
    initialPaymentAmount: number;
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
    cancelTxHash: string;
    cancelTxStatus: number;
    initialPaymentTxHash: string;
    initialPaymentTxStatus: number;
    pullPaymentAddress: string;
    merchantAddress: string;
    userId: string;
    networkID: number;
}