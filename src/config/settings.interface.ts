import { Options } from 'morgan';
import { LoggerOptions } from 'winston';

export interface Settings {
  coreApiURL: string;
  merchantURL: string;
  apiPath?: string;
  env?: string;
  host: string;
  morgan?: Options;
  port?: number | string;
  winston?: LoggerOptions;
  serverSecret: string;
  pgUser: string;
  pgHost: string;
  database: string;
  pgPassword: string;
  pgPort: number | string;
  networkID: number;
  keyDbUser: string;
  keyDbHost: string;
  keyDb: string;
  keyDbPort: string | number;
  keyDbPass: string;
  mnemonicID: string;
  mobileValidationUrl: string;
}
