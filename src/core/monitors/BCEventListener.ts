import { Config } from '../../config';
import { LoggerInstance } from 'winston';
import { LoggerFactory } from '../../utils/logger';
import { Globals } from '../../utils/globals';
import { SmartContractReader } from '../../utils/blockchain/SmartContractReader';
import { PaymentDbConnector } from '../../connectors/dbConnector/PaymentDbConnector';
import { TransactionConnector } from '../../connectors/api/v1/TransactionConnector';
import { ITransactionInsert } from '../../core/transaction/models';

const WEB3 = require('web3');

export class BCEventListener {

  private static loggerFactory: LoggerFactory = new LoggerFactory(Config.settings.winston, Config.settings.morgan);
  private static logger: LoggerInstance = BCEventListener.loggerFactory.getInstance('BCEventListener');
  private smartContractReader: SmartContractReader;
  private paymentDbConnector: PaymentDbConnector;
  private web3: any;
  private transactionConnector: TransactionConnector;

  public constructor(private networkID: number) {
    const infuraURL = `wss://${Globals.GET_NETWORK_NAME(networkID)}.infura.io/ws`;
    this.web3 = new WEB3(new WEB3.providers.WebsocketProvider(infuraURL));
    const provider = new WEB3.providers.WebsocketProvider(`wss://${Globals.GET_NETWORK_NAME(networkID)}.infura.io/ws`);
    this.smartContractReader = new SmartContractReader(Globals.GET_PULL_PAYMENT_CONTRACT_NAME(), networkID);
    this.paymentDbConnector = new PaymentDbConnector();
    this.transactionConnector = new TransactionConnector();
    this.web3.eth.net.isListening()
      .then(() => {
        BCEventListener.logger.info('Monitoring logs for smart contract registration and cancelation');
      })
      .catch(e => {
        BCEventListener.logger.error(`Monitoring the blockchain failed, ${e.message}`);
      });

    provider.on('end', (e) => {
      this.reconnectToEtherscan(e);
    });

  }

  public async monitor() {
    const registerTopic = [Globals.GET_PULL_PAYMENT_TOPICS().register];
    const cancelTopic = [Globals.GET_PULL_PAYMENT_TOPICS().cancel];

    this.web3.eth.subscribe('logs', {
      address: Globals.GET_SMART_CONTRACT_ADDRESS().pumaPayPullPayment,
      topics: registerTopic
    }, async (error, response) => {
      try {
        const logResponse = await this.smartContractReader.readEventLogs(registerTopic[0], response.data);
        if (logResponse && logResponse.paymentID && logResponse.beneficiaryAddress) {
          const paymentData = await this.paymentDbConnector.getPaymentByID(logResponse.paymentID);
          if (paymentData.success && paymentData.data.length > 0) {
            BCEventListener.logger.info(`Smart Contract Registration Detected.`);
            try {
              await this.transactionConnector.createTransaction({
                hash: response.transactionHash,
                typeID: Globals.GET_TRANSACTION_TYPE_ENUM()['register'],
                paymentID: logResponse.paymentID,
                timestamp: Math.floor(new Date().getTime() / 1000),
                statusID: null
              });

              BCEventListener.logger.info(`Adding new registration. Transaction hash: ${response.transactionHash}`);
            } catch (err) {

              BCEventListener.logger.error(`There was an error while adding transaction: ${err.message}`);
            }
          }
        }

      } catch (err) {
        BCEventListener.logger.error(`Enable to decode log ${err.message}`);
      }

    }).on('error', (error) => {
      BCEventListener.logger.error(`Failed to subscribe to etherscan logs: ${error}`);
    });

    this.web3.eth.subscribe('logs', {
      address: Globals.GET_SMART_CONTRACT_ADDRESS().pumaPayPullPayment,
      topics: cancelTopic
    }, async (error, response) => {
      try {
        const logResponse = await this.smartContractReader.readEventLogs(cancelTopic[0], response.data);
        if (logResponse && logResponse.paymentID && logResponse.beneficiaryAddress) {
          const paymentData = await this.paymentDbConnector.getPaymentByID(logResponse.paymentID);
          if (paymentData.success && paymentData.data.length > 0) {
            BCEventListener.logger.info(`Smart Contract Cancelation Detected.`);
            try {
              await this.transactionConnector.createTransaction({
                hash: response.transactionHash,
                typeID: Globals.GET_TRANSACTION_TYPE_ENUM()['cancel'],
                paymentID: logResponse.paymentID,
                timestamp: Math.floor(new Date().getTime() / 1000),
                statusID: null
              });

              BCEventListener.logger.info(`Canceling a registration. Transaction hash: ${response.transactionHash}`);
            } catch (err) {

              BCEventListener.logger.error(`There was an error while canceling transaction: ${err.message}`);
            }
          }
        }

      } catch (err) {
        BCEventListener.logger.error(`Enable to decode log ${err.message}`);
      }

    }).on('error', (error) => {
      BCEventListener.logger.error(`Failed to subscribe to etherscan logs: ${error}`);
    });

  }

  private reconnectToEtherscan(e: any) {
    try {
      BCEventListener.logger.warn(`Etherscan websocket connection has closed. ${e}`);
      BCEventListener.logger.info(`Attempting to reconnect...`);
      const p = new WEB3.providers.WebsocketProvider(`wss://${Globals.GET_NETWORK_NAME(this.networkID)}.infura.io/ws`);
      p.on('end', this.reconnectToEtherscan);
      this.web3.setProvider(p);
      this.monitor();
    } catch (error) {
      BCEventListener.logger.error(`Etherscan websocket reconnection has failed...${error.message}`);
    }
  }
}