import { Settings } from './settings.interface';
import winston from 'winston';

export class DefaultConfig {
  public static get settings(): Settings {
    return {
      apiURL: process.env.API_URL ? process.env.API_URL : 'localhost',
      apiPath: '/api/v1',
      env: process.env.NODE_ENV,
      host: '0.0.0.0',
      morgan: {},
      port: process.env.PORT ? Number(process.env.PORT) : 3000,
      pgUser: process.env.PGUSER ? process.env.PGUSER : 'local_user',
      pgHost: process.env.PGHOST ? process.env.PGHOST : 'localhost',
      database: process.env.PGDATABASE ? process.env.PGDATABASE : 'local_merchant_server',
      pgPassword: process.env.PGPASSWORD ? process.env.PGPASSWORD : 'local_pass',
      pgPort: process.env.PGPORT ? Number(process.env.PGPORT) : 5431,
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
