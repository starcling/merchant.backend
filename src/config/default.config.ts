import { Settings } from './settings.interface';
import winston from 'winston';

export class DefaultConfig {
  public static get settings(): Settings {
    return {
      apiPath: '/api/v1',
      env: process.env.NODE_ENV,
      host: '0.0.0.0',
      morgan: {},
      port: '3000',
      pgUser: process.env.PGUSER ? process.env.PGUSER : 'local_user',
      pgHost: process.env.PGHOST ? process.env.PGHOST : 'localhost',
      database: process.env.PGDATABASE ? process.env.PGDATABASE : 'local_merchant_server',
      pgPassword: process.env.PGPASSWORD ? process.env.PGPASSWORD : 'local_pass',
      pgPort: process.env.PGPORT ? Number(process.env.PGPORT) : 5435,
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
