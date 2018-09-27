import { Settings } from './settings.interface';
import winston from 'winston';
import { Globals } from '../utils/globals';

export class DevelopmentConfig {
  public static get settings(): Settings {
    return {
      host: '0.0.0.0',
      serverSecret: 'sUp4hS3cr37kE9c0D3',
      port: process.env.PORT ? process.env.PORT : '3000',
      coreApiURL: process.env.CORE_API_URL ? process.env.CORE_API_URL : 'localhost',
      merchantURL: process.env.MERCHANT_URL ? process.env.MERCHANT_URL : 'http://merchant_server:3000',
      pgUser: process.env.PGUSER ? process.env.PGUSER : 'local_user',
      pgHost: process.env.PGHOST ? process.env.PGHOST : 'localhost',
      database: process.env.PGDATABASE ? process.env.PGDATABASE : 'local_merchant_server',
      pgPassword: process.env.PGPASSWORD ? process.env.PGPASSWORD : 'local_pass',
      pgPort: process.env.PGPORT ? Number(process.env.PGPORT) : 5431,
      networkID: process.env.ETH_NETWORK ? Number(process.env.ETH_NETWORK) : 3,
      keyDbPort: process.env.KEY_DB_PORT ? process.env.KEY_DB_PORT : 3305,
      keyDbUser: process.env.KEY_DB_USER ? process.env.KEY_DB_USER : 'db_service',
      keyDbPass: process.env.KEY_DB_PASS ? process.env.KEY_DB_PASS : 'db_pass',
      keyDbHost: process.env.KEY_DB_HOST ? process.env.KEY_DB_HOST : 'db',
      keyDb: process.env.KEY_DB ? process.env.KEY_DB : 'keys',
      mnemonicID: process.env.MNEMONIC_ID ? process.env.MNEMONIC_ID : 'mnemonic_phrase',
      balanceNotificationEmailAddress: process.env.BALANCE_CHECK_EMAIL || 'developers@pumapay.io',
      mobileValidationUrl: Globals.GET_MOBILE_VALIDATION_URL(),
      winston: {
        transports: [
          new winston.transports.Console({
            level: 'debug',
            prettyPrint: true,
            handleExceptions: true,
            json: false,
            colorize: true
          })
        ],
        exitOnError: false
      }
    };
  }
}
