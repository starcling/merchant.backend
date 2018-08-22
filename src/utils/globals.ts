import { DefaultConfig } from '../config/default.config';
import { PaymentDbConnector } from '../connectors/api/v1/dbConnector/PaymentDbConnector';
const web3 = require('web3');

export class Globals {
    public static GET_NETWORK(networkID: number): string {
        switch (networkID) {
            case(1):
                return 'mainnet';
            case(3):
                return 'ropsten';
        }
    }

    public static GET_SPECIFIC_INFURA_URL(networkID: number): string {
        return `https://${this.GET_NETWORK(networkID)}.infura.io/${this.GET_INFURA_API_KEY()}`;
    }

    public static GET_INFURA_API_KEY(): string {
        return 'eS5XgCLEJRygOsT6E4Bf';
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