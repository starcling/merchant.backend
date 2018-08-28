import { DefaultConfig } from '../config/default.config';
import { PaymentDbConnector } from '../connectors/dbConnector/PaymentDbConnector';
import { EnumDbConnector } from '../connectors/dbConnector/EnumDbConnector';
const web3 = require('web3');

export class Globals {
    private static paymentTypeEnums: any;
    private static contractStatusEnums: any;
    private static transactionTypeEnums: any;
    private static transactionStatusEnums: any;

    public static GET_NETWORK(networkID: number): string {
        switch (networkID) {
            case (1):
                return 'mainnet';
            case (3):
                return 'ropsten';
        }
    }

    public static GET_SPECIFIC_INFURA_URL(networkID: number): string {
        return `https://${this.GET_NETWORK(networkID)}.infura.io/${this.GET_INFURA_API_KEY()}`;
    }

    public static GET_INFURA_API_KEY(): string {
        return 'eS5XgCLEJRygOsT6E4Bf';
    }

    public static GET_ENUM_TABLE_NAMES(): IEnumTableNames {
        return {
            paymentType: 'tb_payment_type',
            contractStatus: 'tb_contract_status',
            transactionType: 'tb_transaction_type',
            transactionStatus: 'tb_transaction_status'
        };
    }

    public static async REFRESH_ENUMS(): Promise<any> {
        Globals.paymentTypeEnums = (await new EnumDbConnector().getPaymentTypes()).data;
        Globals.contractStatusEnums = (await new EnumDbConnector().getContractStatuses()).data;
        Globals.transactionTypeEnums = (await new EnumDbConnector().getTransactionTypes()).data;
        Globals.transactionStatusEnums = (await new EnumDbConnector().getTransactionStatuses()).data;
    }

    public static GET_PAYMENT_TYPE_ENUM(): string[] {
        const payload = [];

        for (const d of this.paymentTypeEnums) {
            payload[d.id] = d.name;
        }

        return payload;
    }

    public static GET_CONTRACT_STATUS_ENUM(): string[] {
        const payload = [];

        for (const d of this.contractStatusEnums) {
            payload[d.id] = d.name;
        }

        return payload;
    }

    public static GET_TRANSACTION_STATUS_ENUM(): string[] {
        const payload = [];

        for (const d of this.transactionStatusEnums) {
            payload[d.id] = d.name;
        }

        return payload;
    }

    public static GET_TRANSACTION_TYPE_ENUM(): string[] {
        const payload = [];

        for (const d of this.transactionTypeEnums) {
            payload[d.id] = d.name;
        }

        return payload;
    }

    public static GET_DEFAULT_SDK_BUILD(networkID: number): any {
        return {
            web3: new web3(new web3.providers.HttpProvider(this.GET_SPECIFIC_INFURA_URL(networkID))),
            merchantApiUrl: `${DefaultConfig.settings.merchantURL}/api/v1`,
            pgUser: DefaultConfig.settings.pgUser,
            pgHost: DefaultConfig.settings.pgHost,
            pgPort: Number(DefaultConfig.settings.pgPort),
            pgDatabase: DefaultConfig.settings.database,
            pgPassword: DefaultConfig.settings.pgPassword,
            redisHost: process.env.REDIS_HOST,
            redisPort: process.env.REDIS_PORT,
            createPayment: new PaymentDbConnector().createPayment,
            deletePayment: new PaymentDbConnector().deletePayment,
            getAllPayments: new PaymentDbConnector().getAllPayments,
            getPayment: new PaymentDbConnector().getPayment,
            updatePayment: new PaymentDbConnector().updatePayment
        };
    }
}

interface IEnumTableNames {
    paymentType: string;
    contractStatus: string;
    transactionType: string;
    transactionStatus: string;
}