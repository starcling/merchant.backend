import { DefaultConfig } from '../config/default.config';
import { EnumDbConnector } from '../connectors/dbConnector/EnumDbConnector';
import { PaymentDbConnector } from '../connectors/dbConnector/PaymentDbConnector';
import { TransactionDbConnector } from '../connectors/dbConnector/TransactionDbConnector';
import { PrivateKeysDbConnector } from '../connectors/dbConnector/PrivateKeysDbConnector';
import { CreatePaymentModelHandler } from '../core/paymentModel/CreatePaymentModelHandler';
import { RedisClientCreator } from './redisClientCreator/RedisClientCreator';

const web3 = require('web3');

export class Globals {
    private static paymentModelTypeEnums: any;
    private static paymentStatusEnums: any;
    private static transactionTypeEnums: any;
    private static transactionStatusEnums: any;

    public static GET_NETWORK_NAME(networkID: number): string {
        switch (networkID) {
            case (1):
                return 'mainnet';
            case (3):
                return 'ropsten';
        }
    }

    public static GET_LOWERCASE_ALPHANUMERIC_REG_EXPRESSION(): RegExp {
        return new RegExp(/^[a-z0-9]+$/);
    }

    public static GET_ALPHANUMERIC_REG_EXPRESSION(): RegExp {
        return new RegExp(/^[a-zA-Z0-9]+$/);
    }

    public static GET_UPPERCASE_ALPABETIC_REG_EXPRESSION(): RegExp {
        return new RegExp(/^[A-Z]+$/);
    }

    public static GET_UUID_REG_EXPRESSION(): RegExp {
        return new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    }

    public static GET_SPECIFIC_INFURA_URL(networkID: number): string {
        return `https://${this.GET_NETWORK_NAME(networkID)}.infura.io/${this.GET_INFURA_API_KEY()}`;
    }

    public static GET_INFURA_API_KEY(): string {
        return 'eS5XgCLEJRygOsT6E4Bf';
    }

    public static BALANCE_CHECK_INTERVAL(): number {
        return Number(process.env.BALANCE_MONITOR_INTERVAL) || 21600000; // 6 hours in miliseconds
    }

    public static BALANCE_CHECK_THRESHOLD(): number {
        return Number(process.env.BALANCE_CHECK_THRESHOLD) || 0.1;
    }

    public static GET_SQ_MAIL_API_KEY(): string {
        return process.env.SENDGRID_API_KEY || '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';
    }

    public static GET_ENUM_TABLE_NAMES(): IEnumTableNames {
        return {
            paymentModelType: 'tb_payment_model_type',
            paymentStatus: 'tb_payment_status',
            transactionType: 'tb_transaction_type',
            transactionStatus: 'tb_transaction_status'
        };
    }

    public static async REFRESH_ENUMS(): Promise<any> {
        return {
            paymentModelTypeEnums: Globals.paymentModelTypeEnums = (await new EnumDbConnector().getPaymentModelTypes()).data,
            paymentStatusEnums: Globals.paymentStatusEnums = (await new EnumDbConnector().getPaymentStatuses()).data,
            transactionTypeEnums: Globals.transactionTypeEnums = (await new EnumDbConnector().getTransactionTypes()).data,
            transactionStatusEnums: Globals.transactionStatusEnums = (await new EnumDbConnector().getTransactionStatuses()).data
        };
    }

    public static GET_PAYMENT_TYPE_ENUM_NAMES(): any {
        return PaymentTypeEnum;
    }

    public static GET_PAYMENT_STATUS_ENUM_NAMES(): any {
        return PaymentStatusEnum;
    }

    public static GET_PAYMENT_TYPE_ENUM(): any[] {
        const payload = [];

        for (const d of this.paymentModelTypeEnums) {
            payload[d.id] = d.name;
            payload[d.name] = d.id;
        }

        return payload;
    }

    public static GET_PAYMENT_STATUS_ENUM(): string[] {
        const payload = [];

        for (const d of this.paymentStatusEnums) {
            payload[d.id] = d.name;
            payload[d.name] = d.id;
        }

        return payload;
    }

    public static GET_TRANSACTION_STATUS_ENUM(): string[] {
        const payload = [];

        for (const d of this.transactionStatusEnums) {
            payload[d.id] = d.name;
            payload[d.name] = d.id;
        }

        return payload;
    }

    public static GET_TRANSACTION_TYPE_ENUM(): string[] {
        const payload = [];

        for (const d of this.transactionTypeEnums) {
            payload[d.id] = d.name;
            payload[d.name] = d.id;
        }

        return payload;
    }

    public static GET_DEFAULT_SDK_BUILD(networkID: number): any {
        return {
            web3: new web3(new web3.providers.HttpProvider(this.GET_SPECIFIC_INFURA_URL(networkID))),
            merchantApiUrl: `${DefaultConfig.settings.merchantURL}/api/v2`,
            pgUser: DefaultConfig.settings.pgUser,
            pgHost: DefaultConfig.settings.pgHost,
            pgPort: Number(DefaultConfig.settings.pgPort),
            pgDatabase: DefaultConfig.settings.database,
            pgPassword: DefaultConfig.settings.pgPassword,
            redisClient: new RedisClientCreator().getRedisConnection(),
            getEnums: Globals.REFRESH_ENUMS,
            network: Globals.GET_NETWORK_NAME(networkID),
            getPullPayment: new PaymentDbConnector().getPaymentByID,
            updatePullPayment: new PaymentDbConnector().updatePayment,
            getTransactions: new TransactionDbConnector().getTransactionsByContractID,
            createTransaction: new TransactionDbConnector().createTransaction,
            updateTransaction: new TransactionDbConnector().updateTransaction,
            getPrivateKey: new PrivateKeysDbConnector().getPrivateKey,
            bankAddress: new CreatePaymentModelHandler().getBankAddress
        };
    }

    public static GET_CORE_API_URL(): string {
        return DefaultConfig.settings.coreApiURL;
    }

    public static GET_MOBILE_VALIDATION_URL(): string {
        return '/mobile/validate/';
    }

    public static GET_FCM_MOBILE_TOKEN_NAME(): string {
        return 'fcm-mobile-token';
    }

    public static GET_TEST_FCM_TOKEN(): string {
        return 'MY1hzxVMVpvCrXkLDytdH3Dic2NpGjRKzPukTbJB';
    }

    public static GET_API_KEY_NAME(): string {
        return 'pma-api-key';
    }

    public static GET_CORE_API_KEY_NAME(): string {
        return 'pma-merchant-api-key';
    }

    public static GET_TEST_API_KEY(): string {
        return 'C2qrR2dbsBqGVbeZZXFRnzN5YzPmX564UAPHJFgX';
    }

    public static GET_MERCHANT_ID(): string {
        return process.env.MERCHANT_ID;
    }

    public static GET_CORE_API_KEY(): string {
        return process.env.CORE_API_KEY;
    }

    public static GET_ENVIRONMENT_TYPES(): any {
        return EnvironmentTypesEnum;
    }

    public static GET_AWS_KEY_ID(): string {
        return process.env.AWS_KEY_ID;
    }

    public static GET_ENCRYPTION_MODULE(): string {
        return process.env.ENCRYPTION_MODULE;
    }

    public static GET_CURRENCIES(): CurrenciesEnum[] {
        return [CurrenciesEnum.USD,
            CurrenciesEnum.JPY,
            CurrenciesEnum.EUR,
            CurrenciesEnum.GBP];
    }
}

enum PaymentTypeEnum {
    push = 1,
    singlePull = 2,
    recurringPull = 3,
    recurringWithInitial = 4
}

enum PaymentStatusEnum {
    initial = 1,
    running = 2,
    stopped = 3,
    cancelled = 4,
    done = 5
}

enum CurrenciesEnum {
    EUR = 'EUR',
    USD = 'USD',
    GBP = 'GBP',
    JPY = 'JPY'
}

interface IEnumTableNames {
    paymentModelType: string;
    paymentStatus: string;
    transactionType: string;
    transactionStatus: string;
}

enum EnvironmentTypesEnum {
    development = 'development',
    staging = 'staging',
    production = 'production'
}
