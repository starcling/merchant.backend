import { Config } from '../../config';
import { LoggerInstance } from 'winston';
import { LoggerFactory } from '../../utils/logger';
import { Globals } from '../../utils/globals';
import { SmartContractReader } from '../../utils/blockchain/SmartContractReader';
import { PaymentDbConnector } from '../../connectors/dbConnector/PaymentDbConnector';
import { TransactionConnector } from '../../connectors/api/v1/TransactionConnector';
import { RedisClientCreator } from '../../utils/redisClientCreator/RedisClientCreator';

const WEB3 = require('web3');

export class BCEventListener {

    private static loggerFactory: LoggerFactory = new LoggerFactory(Config.settings.winston, Config.settings.morgan);
    private static logger: LoggerInstance = BCEventListener.loggerFactory.getInstance('BCEventListener');
    private smartContractReader: SmartContractReader;
    private paymentDbConnector: PaymentDbConnector;
    private web3: any;
    private redisClient: any;
    private etherscanHealthCheckInterval: any = null;
    private transactionConnector: TransactionConnector;

    public constructor(private networkID: number) {
        const infuraURL = `wss://${Globals.GET_NETWORK_NAME(networkID)}.infura.io/ws`;
        this.web3 = new WEB3(new WEB3.providers.WebsocketProvider(infuraURL));
        this.smartContractReader = new SmartContractReader(Globals.GET_PULL_PAYMENT_CONTRACT_NAME(), networkID);
        this.paymentDbConnector = new PaymentDbConnector();
        this.redisClient = new RedisClientCreator().getRedisConnection();
        this.transactionConnector = new TransactionConnector();
        this.web3.eth.net.isListening()
            .then(() => {
                BCEventListener.logger.info('Monitoring logs for smart contract registration and cancelation');
            })
            .catch(e => {
                BCEventListener.logger.error(`Monitoring the blockchain failed, ${e.message}`);
            });
    }

    public async monitor() {
        const registerTopic = [Globals.GET_PULL_PAYMENT_TOPICS().register];
        const cancelTopic = [Globals.GET_PULL_PAYMENT_TOPICS().cancel];

        this.getMissingLogs();

        this.web3.eth.subscribe('logs', {
            address: Globals.GET_SMART_CONTRACT_ADDRESS().pumaPayPullPayment,
            topics: registerTopic
        }, async (error, response) => {
            if (!error) {
                this.handleRegisterLog(error, response);
            }
        }).on('error', (error) => {
            BCEventListener.logger.error(`Failed to subscribe to etherscan logs: ${error}`);
        });

        this.web3.eth.subscribe('logs', {
            address: Globals.GET_SMART_CONTRACT_ADDRESS().pumaPayPullPayment,
            topics: cancelTopic
        }, async (error, response) => {
            if (!error) {
                this.handleCancelLog(error, response);
            }
        }).on('error', (error) => {
            BCEventListener.logger.error(`Failed to subscribe to etherscan logs: ${error}`);
        });

        clearTimeout(this.etherscanHealthCheckInterval);
        this.etherscanHealthCheckInterval = setTimeout(this.socketHealthCheck, Globals.GET_ETHERSCAN_HEALTH_CHECK_INTERVAL());

    }

    private async getMissingLogs() {
        const registerTopic = [Globals.GET_PULL_PAYMENT_TOPICS().register];
        const cancelTopic = [Globals.GET_PULL_PAYMENT_TOPICS().cancel];
        await this.initRedisBlocks();

        this.web3.eth.getPastLogs({
            fromBlock: await this.getLastCheckedRegisterBlock(),
            toBlock: 'latest',
            address: Globals.GET_SMART_CONTRACT_ADDRESS().pumaPayPullPayment,
            topics: registerTopic
        }, async (error, response) => {
            try {
                for (const log of response) {
                    this.handleRegisterLog(error, log);
                }
            } catch (e) {
                BCEventListener.logger.error(`There was an error processing missing  register logs: ${e.message}`);
            }
        });

        this.web3.eth.getPastLogs({
            fromBlock: await this.getLastCheckedCancelBlock(),
            toBlock: 'latest',
            address: Globals.GET_SMART_CONTRACT_ADDRESS().pumaPayPullPayment,
            topics: cancelTopic
        }, async (error, response) => {
            try {
                for (const log of response) {
                    this.handleCancelLog(error, log);
                }
            } catch (e) {
                BCEventListener.logger.error(`There was an error processing missing cancel logs: ${e.message}`);
            }
        });
    }

    private async handleRegisterLog(error: any, response: any) {
        const registerTopic = [Globals.GET_PULL_PAYMENT_TOPICS().register];

        try {
            const logResponse = this.smartContractReader.readEventLogs(registerTopic[0], response.data);
            if (logResponse && logResponse.paymentID && logResponse.beneficiaryAddress) {
                this.setLastCheckedRegsiterBlock(response.blockNumber);
                const paymentData = await this.paymentDbConnector.getPaymentByID(logResponse.paymentID);
                if (paymentData.success && paymentData.data.length > 0) {
                    BCEventListener.logger.info(`Smart Contract Registration Detected.`);
                    try {
                        this.transactionConnector.createTransaction({
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
    }

    private async handleCancelLog(error: any, response: any) {
        const cancelTopic = [Globals.GET_PULL_PAYMENT_TOPICS().cancel];

        try {
            const logResponse = this.smartContractReader.readEventLogs(cancelTopic[0], response.data);
            if (logResponse && logResponse.paymentID && logResponse.beneficiaryAddress) {
                this.setLastCheckedCancelBlock(response.blockNumber);
                const paymentData = await this.paymentDbConnector.getPaymentByID(logResponse.paymentID);
                if (paymentData.success && paymentData.data.length > 0) {
                    BCEventListener.logger.info(`Smart Contract Cancelation Detected.`);
                    try {
                        this.transactionConnector.createTransaction({
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
    }

    private async getLastCheckedRegisterBlock(): Promise<number> {
        return Number(await this.redisClient.getAsync('lastCheckedRegisterBlock'));
    }

    private async getLastCheckedCancelBlock(): Promise<number> {
        return Number(await this.redisClient.getAsync('lastCheckedCancelBlock'));
    }

    private async setLastCheckedRegsiterBlock(blockNumber: number): Promise<any> {
        return await this.redisClient.setAsync('lastCheckedRegisterBlock', blockNumber);
    }

    private async setLastCheckedCancelBlock(blockNumber: number): Promise<any> {
        return await this.redisClient.setAsync('lastCheckedCancelBlock', blockNumber);
    }

    private async initRedisBlocks() {
        const registerBlock = await this.getLastCheckedRegisterBlock();
        const cancelBlock = await this.getLastCheckedCancelBlock();
        try {
            const latest = await this.web3.eth.getBlockNumber();
            if (registerBlock === 0) {
                await this.setLastCheckedRegsiterBlock(latest);
            }

            if (cancelBlock === 0) {
                await this.setLastCheckedCancelBlock(latest);
            }
        } catch (e) {
            BCEventListener.logger.error(`There was an error while getting latest block: ${e.message}`);
        }
    }

    // This is used to regulary check for the socket health.
    private socketHealthCheck = async () => {
        BCEventListener.logger.info('Socket health check start');
        try {
            clearTimeout(this.etherscanHealthCheckInterval);
            this.etherscanHealthCheckInterval = setTimeout(this.socketHealthCheck, Globals.GET_ETHERSCAN_HEALTH_CHECK_INTERVAL());
            await this.web3.eth.getBlockNumber();
        } catch (e) {
            this.reconnectToEtherscan(e);
        }
    };

    private reconnectToEtherscan(e: any) {
        try {
            BCEventListener.logger.warn(`Etherscan websocket connection has closed. ${e}`);
            BCEventListener.logger.info(`Attempting to reconnect...`);
            const p = new WEB3.providers.WebsocketProvider(`wss://${Globals.GET_NETWORK_NAME(this.networkID)}.infura.io/ws`);
            p.on('end', (err) => {
                this.reconnectToEtherscan(err);
            });
            this.web3.setProvider(p);
            this.monitor();
            this.web3.eth.net.isListening()
                .then(() => {
                    BCEventListener.logger.info('Monitoring logs for smart contract registration and cancelation');
                })
                .catch(eror => {
                    BCEventListener.logger.error(`Monitoring the blockchain failed, ${eror.message}`);
                });
        } catch (error) {
            this.reconnectToEtherscan(error);
            BCEventListener.logger.error(`Etherscan websocket reconnection has failed...${error.message}`);
            this.reconnectToEtherscan(error);
        }
    }
}