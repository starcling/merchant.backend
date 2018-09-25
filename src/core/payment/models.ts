export interface IPaymentView {
    id: string;
    title: string;
    description: string;
    promo: string;
    amount: number;
    initialPaymentAmount: number;
    initialNumberOfPayments: number;
    currency: string;
    hdWalletIndex: number;
    numberOfPayments: number;
    frequency: number;
    typeID: number;
    networkID: number;
    automatedCashOut: boolean;
    cashOutFrequency: number;
    type: string;
    status: string;
    nextPaymentDate: number;
    lastPaymentDate: number;
    startTimestamp: number;
    customerAddress: string;
    merchantAddress: string;
    pullPaymentAddress: string;
    userID: string;
}

export interface IPaymentInsert {
    hdWalletIndex: number;
    pullPaymentModelID: string;
    numberOfPayments: number;
    nextPaymentDate: number;
    startTimestamp: number;
    customerAddress: string;
    merchantAddress: string;
    pullPaymentAddress: string;
    userID: string;
}

export interface IPaymentUpdate {
    id: string;
    hdWalletIndex: number;
    numberOfPayments: number;
    nextPaymentDate: number;
    lastPaymentDate: number;
    startTimestamp: number;
    merchantAddress: string;
    statusID: number;
    userID: string;
    networkID: number;
}