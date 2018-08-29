export interface IPaymentContractView {
    id: string;
    title: string;
    description: string;
    promo: string;
    amount: number;
    initialPaymentAmount: number;
    currency: string;
    hdWalletIndex: number;
    numberOfPayments: number;
    frequency: number;
    type: string;
    status: string;
    networkID: string;
    nextPaymentDate: number;
    lastPaymentDate: number;
    startTimestamp: number;
    customerAddress: string;
    merchantAddress: string;
    pullPaymentAddress: string;
    userID: string;
}

export interface IPaymentContractInsert {
    hdWalletIndex: number;
    paymentID: string;
    numberOfPayments: number;
    nextPaymentDate: number;
    lastPaymentDate: number;
    startTimestamp: number;
    customerAddress: string;
    merchantAddress: string;
    pullPaymentAddress: string;
    statusID: number;
    userID: string;
}

export interface IPaymentContractUpdate {
    id: string;
    hdWalletIndex: number;
    numberOfPayments: number;
    nextPaymentDate: number;
    lastPaymentDate: number;
    startTimestamp: number;
    statusID: number;
    userID: string;
}