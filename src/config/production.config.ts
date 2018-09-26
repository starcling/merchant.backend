import { Settings } from './settings.interface';
import winston from 'winston';

export class ProductionConfig {
  public static get settings(): Settings {
    return {
      apiURL: process.env.API_URL ? process.env.API_URL : 'http://18.185.130.3/core',
      merchantURL: process.env.MERCHANT_URL ? process.env.MERCHANT_URL : 'http://18.196.208.131/merchant',
      apiPath: '/api/v1',

      env: process.env.NODE_ENV ? process.env.NODE_ENV : 'production',

      host: '0.0.0.0',
      port: process.env.PORT ? process.env.PORT : '3000',

      pgHost: process.env.PGHOST ? process.env.PGHOST : 'localhost',
      pgPort: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,

      pgUser: process.env.PGUSER ? process.env.PGUSER : 'local_user',
      pgPassword: process.env.PGPASSWORD ? process.env.PGPASSWORD : 'local_pass',
      database: process.env.PGDATABASE ? process.env.PGDATABASE : 'local_merchant_server',

      serverSecret: 'sUp4hS3cr37kE9c0D3',
      networkID: process.env.ETH_NETWORK ? Number(process.env.ETH_NETWORK) : 1,

      keyDbPort: process.env.KEY_DB_PORT ? process.env.KEY_DB_PORT : 3305,
      keyDbUser: process.env.KEY_DB_USER ? process.env.KEY_DB_USER : 'db_service',
      keyDbPass: process.env.KEY_DB_PASS ? process.env.KEY_DB_PASS : 'db_pass',
      keyDbHost: process.env.KEY_DB_HOST ? process.env.KEY_DB_HOST : 'db',
      keyDb: process.env.KEY_DB ? process.env.KEY_DB : 'keys',
      mnemonicID: process.env.MNEMONIC_ID ? process.env.MNEMONIC_ID : 'mnemonic_phrase',
      balanceNotificationEmailAddress: process.env.BALANCE_CHECK_EMAIL_PROD || 'developers@pumapay.io',

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
