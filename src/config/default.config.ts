import { Settings } from './settings.interface';
import winston from 'winston';

export class DefaultConfig {
  public static get settings(): Settings {
    return {
      apiURL: process.env.API_URL ? process.env.API_URL : 'core_server',
      merchantURL: process.env.MERCHANT_URL ? process.env.MERCHANT_URL : 'http://merchant_server:3000',
      apiPath: '/api/v1',
      env: process.env.NODE_ENV,
      host: process.env.HOST ? process.env.HOST : '0.0.0.0',
      port: process.env.PORT ? process.env.PORT : '3000',
      pgHost: process.env.PGHOST ? process.env.PGHOST : 'localhost',
      pgPort: process.env.PGPORT ? Number(process.env.PGPORT) : 5431,
      pgUser: process.env.PGUSER ? process.env.PGUSER : 'local_user',
      database: process.env.PGDATABASE ? process.env.PGDATABASE : 'local_merchant_server',
      pgPassword: process.env.PGPASSWORD ? process.env.PGPASSWORD : 'local_pass',
      networkID: process.env.ETH_NETWORK ? Number(process.env.ETH_NETWORK) : 3,
      keyDbPort: process.env.KEY_DB_PORT ? process.env.KEY_DB_PORT : 3305,
      keyDbUser: process.env.KEY_DB_USER ? process.env.KEY_DB_USER : 'db_service',
      keyDbPass: process.env.KEY_DB_PASS ? process.env.KEY_DB_PASS : 'db_pass',
      keyDbHost: process.env.KEY_DB_HOST ? process.env.KEY_DB_HOST : 'db',
      keyDb: process.env.KEY_DB ? process.env.KEY_DB : 'keys',
      mnemonicID: process.env.MNEMONIC_ID ? process.env.MNEMONIC_ID : 'mnemonic_phrase',
      morgan: {},
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
      },
      serverSecret: 'sUp4hS3cr37kE9c0D3'
    };
  }
}
