import winston from 'winston';
import morgan from 'morgan';
import debug from 'debug';
import { LoggerInstance, LoggerOptions } from 'winston';
import { RequestHandler } from 'express';
import { IDebugger } from 'debug';

export class LoggerFactory {
  private debug: IDebugger = debug('api:logger');
  private static loggers: { [id: string]: LoggerInstance } = {};

  public constructor(private winstonOptions?: LoggerOptions,
    private morganOptions?: morgan.Options) {
    this.debug('created loggerFactory. Winston: %O. Morgan: %O.', winstonOptions, morganOptions);
  }

  /**
   * @description Creates or returns an existing instance of a logger that logs with the provided (optional) prefix.
   * @param prefix
   * @returns {LoggerInstance}
   */
  public getInstance(prefix?: string): LoggerInstance {
    prefix = prefix || 'default';
    this.debug(`getting logger with prefix '${prefix}'`);
    if (!LoggerFactory.loggers[prefix]) {
      const logger = new winston.Logger(this.winstonOptions || {});
      if (prefix !== 'default') {
        logger.filters.push((level: string, msg: string, meta: any): string => `[${prefix}] ${msg}`);
      }
      LoggerFactory.loggers[prefix] = logger;
      this.debug('created');
    }

    return LoggerFactory.loggers[prefix];
  }

  /**
   * @description Middleware for Express to log requests.
   * @returns {express.RequestHandler}
   */
  public get requestLogger(): RequestHandler {
    const logger = this.getInstance('RequestLogger');

    const options = this.morganOptions || {};
    options.stream = {
      write: (message: string): void => {
        logger.debug(message);
      }
    };
    this.debug('creating morgan as requestLogger');

    return morgan('dev', options);
  }
}
