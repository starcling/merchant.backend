export interface ITransactionView {
    id: string;
    hash: string;
    status: string;
    type: string;
    timestamp: number;
    paymentID: number;
}

export interface ITransactionUpdate {
    hash: string;
    statusID: number;
}

export interface ITransactionInsert {
    hash: string;
    statusID: number;
    typeID: number;
    paymentID: string;
    timestamp: number;
}

export interface ITransactionGet {
    id: string;
    hash: string;
    paymentID: string;
    statusID: number;
    typeID: number;
}