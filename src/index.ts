import 'reflect-metadata';
import bodyParser from 'body-parser';
import http from 'http';
import express from 'express';
import cors from 'cors';
import debug from 'debug';
import { IDebugger } from 'debug';
import { Application } from 'express';
import { useContainer, RoutingControllersOptions, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import { LoggerInstance } from 'winston';
import { LoggerFactory } from './utils/logger';
import { Config } from './config';
import puma_sdk_core from 'puma_sdk_core';

// // const API_URL = 'http://host.docker.internal/api/v1'; // When use docker
const API_URL = 'http://core_server:8081/api/v1/'; // When do not use docker

class App {
  private loggerFactory: LoggerFactory = new LoggerFactory(Config.settings.winston, Config.settings.morgan);
  private logger: LoggerInstance = this.loggerFactory.getInstance('App');

  private debug: IDebugger = debug('app:main');

  public async run(): Promise<void> {
    this.debug('starting express app');
    const app: Application = express();
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));

    // parse application/json
    app.use(bodyParser.json());
    // allow CORS
    app.use(cors());
    app.use(this.loggerFactory.requestLogger);

    app.get('/', (req, res) => {
      const merchant = new puma_sdk_core({ apiUrl: API_URL });

      merchant.authenticate('user', 'password').then(resp => {
        merchant.getRequest('/exchange/global').then(response => {
          console.debug('getRequest', response);

          res.send(response);
        }
        );
      }).catch(err => {
        console.debug('getRequest error', err);

        res.status(400).send(err);
      });
    });

    this.debug('Dependency Injection');
    useContainer(Container);
    Container.set(LoggerFactory, this.loggerFactory);

    const apiPath = Config.settings.apiPath;
    const routingControllersOptions: RoutingControllersOptions = {
      defaultErrorHandler: false,
      routePrefix: apiPath,
      controllers: [`${__dirname}${apiPath}/*.ts`]
    };

    this.debug('Routing: %o', routingControllersOptions);
    useExpressServer(app, routingControllersOptions);

    // initialize a simple http server
    const server = new http.Server(app);

    this.debug('Listen');
    // listening to host and port defined in configuration
    server.listen(Number(Config.settings.port), Config.settings.host);
    this.logger.info(`Visit API at ${Config.settings.host}:${Config.settings.port}${apiPath}`);

    process.on('unhandledRejection', (error: Error, promise: Promise<any>) => {
      this.logger.error('Unhandled rejection', error.stack);
    });
  }
}

new App().run().catch((error: Error) => {
  console.error('[!!!]', error.stack);
  process.exit(1);
});
