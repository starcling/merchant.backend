import { DefaultConfig } from '../config/default.config';
const web3 = require('web3');

export class Globals {
    public static GET_NETWORK(): string {
        switch (process.env.NODE_ENV) {
            case('production'):
                return 'mainnet';
            case('development'):
                return 'ropsten';
        }
    }

    public static GET_SPECIFIC_INFURA_URL(): string {
        return `https://${this.GET_NETWORK()}.infura.io/${this.GET_INFURA_API_KEY()}`;
    }

    public static GET_INFURA_API_KEY(): string {
        return 'eS5XgCLEJRygOsT6E4Bf';
    }

    public static GET_API_URL(): string {
        return 'http://merchant_server:3000';
    }

    public static GET_DEFAULT_SDK_BUILD(): any {
        return {
            web3: new web3(new web3.providers.HttpProvider(this.GET_SPECIFIC_INFURA_URL())),
            merchantApiUrl: `${this.GET_API_URL()}/api/v1`,
            pgUser: DefaultConfig.settings.pgUser,
            pgHost: DefaultConfig.settings.pgHost,
            pgPort: Number(DefaultConfig.settings.pgPort),
            pgDatabase: DefaultConfig.settings.database,
            pgPassword: DefaultConfig.settings.pgPassword,
            redisHost: process.env.REDIS_HOST,
            redisPort: process.env.REDIS_PORT
        };
    }
}