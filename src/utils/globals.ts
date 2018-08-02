import { DefaultConfig } from '../config/default.config';
const web3 = require('web3');

export class Globals {

    public static GET_SPECIFIC_INFURA_URL(): string {
        return 'https://ropsten.infura.io/eS5XgCLEJRygOsT6E4Bf';
    }

    public static GET_DEFAULT_SDK_BUILD(): any {
        return {
            pgUser: DefaultConfig.settings.pgUser,
            pgHost: DefaultConfig.settings.pgHost,
            pgDatabase: DefaultConfig.settings.database,
            pgPassword: DefaultConfig.settings.pgPassword,
            pgPort: Number(DefaultConfig.settings.pgPort),
            web3: new web3(new web3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL())),
            merchantApiUrl: 'http://merchant_server:3000/api/v1'
        };
    }
}