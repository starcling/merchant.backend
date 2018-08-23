import { Settings } from './settings.interface';

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
      networkID: process.env.ETH_NETWORK ? Number(process.env.ETH_NETWORK) : 1
    };
  }
}
