export interface IPaymentModelInsertDetails {
    merchantID: string;
    title: string;
    description: string;
    promo: string;
    amount: number;
    initialPaymentAmount: number;
    trialPeriod: number;
    currency: string;
    numberOfPayments: number;
    frequency: number;
    typeID: number;
    networkID: number;
    automatedCashOut: boolean;
    cashOutFrequency: number;
}

export interface IPaymentModelUpdateDetails {
    id: string;
    title: string;
    description: string;
    promo: string;
    amount: number;
    initialPaymentAmount: number;
    trialPeriod: number;
    currency: string;
    numberOfPayments: number;
    typeID: number;
    frequency: number;
    userID: string;
    networkID: number;
    automatedCashOut: boolean;
    cashOutFrequency: number;
}