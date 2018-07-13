import { Options } from 'morgan';
import { LoggerOptions } from 'winston';

export interface Settings {
  apiURL: string;
  serverSecret: string;
  pgUser: string;
  pgHost: string;
  database: string;
  pgPassword: string;
  pgPort: number | string;
  apiPath?: string;
  env?: string;
  host: string;
  morgan?: Options;
  port?: number | string;
  winston?: LoggerOptions;
}
