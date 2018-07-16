import { Options } from 'morgan';
import { LoggerOptions } from 'winston';

export interface Settings {
  apiURL: string;
  serverSecret: string;
  pgUser: string;
  pgHost: string;
  database: string;
  pgPassword: string;
  pgPort: number;
  apiPath?: string;
  env?: string;
  host: string;
  morgan?: Options;
  port?: number;
  winston?: LoggerOptions;
}
