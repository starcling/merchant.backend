import { Settings } from './settings.interface';

export class DevelopmentConfig {
  public static get settings(): Settings {
    return {
      host: '0.0.0.0',
      serverSecret: 'sUp4hS3cr37kE9c0D3',
      pgUser: process.env.PGUSER ? process.env.PGUSER : 'local_user',
      pgHost: process.env.PGHOST ? process.env.PGHOST : 'localhost',
      database: process.env.PGDATABASE ? process.env.PGDATABASE : 'local_merchant_server',
      pgPassword: process.env.PGPASSWORD ? process.env.PGPASSWORD : 'local_pass',
      pgPort: process.env.PGPORT ? Number(process.env.PGPORT) : 5435
    };
  }
}
