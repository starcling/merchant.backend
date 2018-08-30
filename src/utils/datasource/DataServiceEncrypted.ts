import * as  mysql from 'mysql';
import { LoggerFactory } from '../logger/LoggerFactory';
import { Container } from 'typedi';
import { LoggerInstance } from 'winston';
import { IResponseMessage } from '../web/HTTPResponseHandler';
import { DefaultConfig } from '../../../src/config/default.config';

export class DataServiceEncrypted {
  private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('DataService');
  private pool: any;
  private databaseConnected: Boolean = false;

  protected async executeQuery(sqlQuery: ISqlQuery): Promise<any> {
    return new Promise((resolve, reject) => {
      this.pool = mysql.createPool({
        user: DefaultConfig.settings.keyDbUser,
        host: DefaultConfig.settings.keyDbHost,
        database: DefaultConfig.settings.keyDb,
        password: DefaultConfig.settings.keyDbPass,
        port: DefaultConfig.settings.keyDbPort,
        multipleStatements: true
      });

      this.pool.getConnection((err, connection) => {
        if (err) {
          this.logger.error(`Error On MySQL Pool. Reason: ${err.message}`);
          process.exit(-1);
        }

        connection.query(sqlQuery.text, sqlQuery.values, (error: any, results: any, fields: any) => {
          if (error) {
            this.pool.end();
            reject(error);
          } else {
            this.pool.end();
            resolve(results);
          }
        });
      });
    });
  }

  public executeQueryAsPromise(sqlQuery: ISqlQuery, isInsert: boolean = false): Promise<IResponseMessage> {
    const queryMessage: IResponseMessage = {
      success: false,
      status: 200,
      message: ''
    };

    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.executeQuery(sqlQuery);
        if (result.affectedRows !== undefined) {
          if (result.affectedRows !== 0) {
            queryMessage.success = true;
            queryMessage.status = 201;
            queryMessage.message = `SQL Insert Query completed successful.`;
            queryMessage.data = {};
            return resolve(queryMessage);
          } else  {
            queryMessage.status = 204;
            queryMessage.message = `SQL Query returned no data from database.`;
            return resolve(queryMessage);
          }
        }

        if (Object.keys(result).length === 0) {
          queryMessage.status = 204;
          queryMessage.message = `SQL Query returned no data from database.`;
          return resolve(queryMessage);
        }

        let statusIndex: string = '-1';
        Object.keys(result).map(key => {
          if (result[key].affectedRows !== undefined) {
            statusIndex = key;
          }
        });

        if (statusIndex === '-1') {
          queryMessage.success = true;
          queryMessage.status = 200;
          queryMessage.message = `SQL Query completed successful.`;
          queryMessage.data = result;

          return resolve(queryMessage);
        }

        if (result[0][0].length === 0) {
          queryMessage.status = 204;
          queryMessage.message = `SQL Query returned no data from database.`;
          return resolve(queryMessage);
        }

        queryMessage.success = true;
        queryMessage.status = 200;
        queryMessage.message = `SQL Query completed successful.`;
        queryMessage.data = result[0];
        resolve(queryMessage);
      } catch (err) {
        queryMessage.status = 400;
        queryMessage.message = `SQL Query failed. Reason: ${err.message}`;
        queryMessage.error = err.code;
        resolve(queryMessage);
      }
    });
  }
  public getConnectionStatus(): Boolean {
    return this.databaseConnected;
  }
}

export interface ISqlQuery {
  text: string;
  values?: any[];
}