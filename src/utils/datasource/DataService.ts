import { Pool, PoolClient } from 'pg';
import { LoggerFactory } from '../logger/LoggerFactory';
import { Container } from 'typedi';
import { LoggerInstance } from 'winston';
import { DbErrorHelper } from './helpers/dbErrorHelper';
import { IResponseMessage } from '../web/HTTPResponseHandler';
import { DefaultConfig } from '../../config/default.config';

export class DataService {
  private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('DataService');
  private pool: Pool;
  protected async executeQuery(sqlQuery: ISqlQuery): Promise<any> {
    this.pool = new Pool({
      user: DefaultConfig.settings.pgUser,
      host: DefaultConfig.settings.pgHost,
      database: DefaultConfig.settings.database,
      password: DefaultConfig.settings.pgPassword,
      port: DefaultConfig.settings.pgPort
  });

    this.pool.on('error', (error: Error, client: PoolClient) => {
      this.logger.error(`Error On PG Pool. Reason: ${error}`);
      process.exit(-1);
    });

    return this.pool.query(sqlQuery);
  }

  public executeQueryAsPromise(sqlQuery: ISqlQuery, isInsert: boolean = false): Promise<any> {
    const queryMessage: IResponseMessage = {
      success: false,
      status: 200,
      message: ''
    };

    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.executeQuery(sqlQuery);
        if (result.rows.length === 0) {
          queryMessage.status = 204;
          queryMessage.message = `SQL Query returned no data from database.`;

          resolve(queryMessage);
        } else if (isInsert) {
          queryMessage.success = true;
          queryMessage.status = 201;
          queryMessage.message = `SQL Insert Query completed successful.`;
          queryMessage.data = result.rows;

          resolve(queryMessage);
        } else {
          queryMessage.success = true;
          queryMessage.status = 200;
          queryMessage.message = `SQL Query completed successful.`;
          queryMessage.data = result.rows;

          resolve(queryMessage);
        }
        this.pool.end();
      } catch (err) {
        const errorReason = DbErrorHelper.GET_DB_ERROR_CODES()[err.code] ? DbErrorHelper.GET_DB_ERROR_CODES()[err.code] : err.stack;
        queryMessage.status = 400;
        queryMessage.message = `SQL Query failed. Reason: ${errorReason}`;
        queryMessage.error = err.code;

        reject(queryMessage);
        this.pool.end();
      }
    });
  }
}

export interface ISqlQuery {
  text: string;
  values?: any[];
}