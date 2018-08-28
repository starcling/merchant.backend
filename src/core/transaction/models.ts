export interface ITransactionView {
    id: string;
    hash: string;
    status: string;
    type: string;
    timestamp: number;
    contractID: number;
}

export interface ITransactionUpdate {
    id: string;
    statusID: number;
}

export interface ITransactionInsert {
    hash: string;
    statusID: number;
    typeID: number;
    contractID: string;
    timestamp: number;
}

export interface ITransactionGet {
    id: string;
    contractID: string;
    statusID: number;
    typeID: number;
}