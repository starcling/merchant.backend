import { Settings } from './settings.interface';
import winston from 'winston';

export class DefaultConfig {
  public static get settings(): Settings {
    return {
      apiURL: process.env.API_URL ? process.env.API_URL : 'core_server',
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
