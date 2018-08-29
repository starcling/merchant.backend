import { DefaultConfig } from '../config/default.config';
import { EnumDbConnector } from '../connectors/dbConnector/EnumDbConnector';
import { ContractDbConnector } from '../connectors/dbConnector/ContractDbConnector';
import { TransactionDbConnector } from '../connectors/dbConnector/TransactionDbConnector';

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
        return {
            paymentTypeEnums: Globals.paymentTypeEnums = (await new EnumDbConnector().getPaymentTypes()).data,
            contranctStatusEnums: Globals.contractStatusEnums = (await new EnumDbConnector().getContractStatuses()).data,
            transactionTypeEnums: Globals.transactionTypeEnums = (await new EnumDbConnector().getTransactionTypes()).data,
            transactionStatusEnums: Globals.transactionStatusEnums = (await new EnumDbConnector().getTransactionStatuses()).data
        };
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
            getEnums: Globals.REFRESH_ENUMS,
            getContract: new ContractDbConnector().getContract,
            updateContract: new ContractDbConnector().updateContract,
            getTransactions: new TransactionDbConnector().getTransactionsByContractID,
            createTransaction: new TransactionDbConnector().createTransaction,
            updateTransaction: new TransactionDbConnector().updateTransaction
        };
    }
}

interface IEnumTableNames {
    paymentType: string;
    contractStatus: string;
    transactionType: string;
    transactionStatus: string;
}