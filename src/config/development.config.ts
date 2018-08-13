import { Settings } from './settings.interface';

export class DevelopmentConfig {
  public static get settings(): Settings {
    return {
        host: '0.0.0.0',
        serverSecret: 'sUp4hS3cr37kE9c0D3',
        port: process.env.PORT ? process.env.PORT : '3000',
        apiURL: process.env.API_URL ? process.env.API_URL : 'localhost',
        pgUser: process.env.PGUSER ? process.env.PGUSER : 'local_user',
        pgHost: process.env.PGHOST ? process.env.PGHOST : 'localhost',
        database: process.env.PGDATABASE ? process.env.PGDATABASE : 'local_merchant_server',
        pgPassword: process.env.PGPASSWORD ? process.env.PGPASSWORD : 'local_pass',
        pgPort: process.env.PGPORT ? Number(process.env.PGPORT) : 5431,
        networkID : process.env.ETH_NETWORK ? Number(process.env.ETH_NETWORK) : 3
    };
  }
}
