export interface PaymentInsertDetails {
    title: string;
    description: string;
    status: number;
    amount: number;
    currency: string;
    startts: number;
    endts: number;
    type: number;
    frequency: number;
}

export interface PaymentPatchDetails {
    id: string;
    title: string;
    description: string;
    promo: string;
    status: number;
    customerAddress: string;
    amount: number;
    currency: string;
    startts: number;
    endts: number;
    type: number;
    frequency: number;
    transactionHash: string;
    debitAccount: string;
}