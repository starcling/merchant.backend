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
import * as YAML from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';
import { MerchantSDK } from './core/MerchantSDK';
import { Globals } from './utils/globals';
import { CreatePaymentModelHandler } from './core/paymentModel/CreatePaymentModelHandler';
import { BankBalanceMonitor } from './core/monitors/BankBalanceMonitor';
import { BCEventListener } from './core/monitors/BCEventListener';

const SWAGGER_DOCUMENT = YAML.load('/usr/src/app/src/swagger.yml');

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

    Globals.REFRESH_ENUMS();
    new CreatePaymentModelHandler().storeBankKey();
    this.logger.info('Stored bank address keys.');
    MerchantSDK.GET_SDK().build(Globals.GET_DEFAULT_SDK_BUILD(Config.settings.networkID));
    this.logger.info('SDK build completed.');
    new BankBalanceMonitor(Number(process.env.ETH_NETWORK)).monitor();
    new BCEventListener(Number(process.env.ETH_NETWORK)).monitor();
    this.debug('Sync with redis completed.');

    this.debug('Dependency Injection');
    useContainer(Container);
    Container.set(LoggerFactory, this.loggerFactory);
    app.use('/api/v2/doc/api', swaggerUi.serve, swaggerUi.setup(SWAGGER_DOCUMENT));
    const apiPath = Config.settings.apiPath;
    const ext = process.env.NODE_ENV === 'development' ? 'ts' : 'js';
    const routingControllersOptions: RoutingControllersOptions = {
      defaultErrorHandler: false,
      routePrefix: apiPath,
      controllers: [`${__dirname}${apiPath}/*.${ext}`]
    };
    this.debug('Routing: %o', routingControllersOptions);
    useExpressServer(app, routingControllersOptions);

    // initialize a simple http server
    const server = new http.Server(app);

    this.debug('Listen');
    // listening to host and port defined in configuration
    server.listen(Number(Config.settings.port), Config.settings.host);
    this.logger.info(`Visit API at ${Config.settings.host}:${Config.settings.port}${apiPath}`);

    app.get('/', (req, res) => {
      res.status(200).send();
    });

    process.on('unhandledRejection', (error: Error, promise: Promise<any>) => {
      this.logger.error('Unhandled rejection. Reason: ', error.stack ? error.stack : error);
    });
  }
}

new App().run().catch((error: Error) => {
  console.error('[!!!]', error.stack);
  process.exit(1);
});
