export interface IPaymentInsertDetails {
    title: string;
    description: string;
    promo: string;
    amount: number;
    initialPaymentAmount: number;
    currency: string;
    numberOfPayments: number;
    frequency: number;
    typeID: number;
    networkID: number;
}

export interface IPaymentUpdateDetails {
    id: string;
    title: string;
    description: string;
    promo: string;
    amount: number;
    initialPaymentAmount: number;
    currency: string;
    numberOfPayments: number;
    typeID: number;
    frequency: number;
    userID: string;
    networkID: number;
}

export interface IPaymentContractView {
    id: string;
    hdWalletIndex: number;
    paymentID: string;
    numberOfPayments: number;
    nextPaymentDate: number;
    lastPaymentDate: number;
    startTimestamp: number;
    customerAddress: string;
    pullPaymentAddress: string;
    statusID: number;
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