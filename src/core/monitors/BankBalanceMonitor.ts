import { Config } from '../../config';
import { LoggerInstance } from 'winston';
import { LoggerFactory } from '../../utils/logger';
import { Globals } from '../../utils/globals';
import { CreatePaymentModelHandler } from '../paymentModel/CreatePaymentModelHandler';
import { EmailHelper } from '../../utils/email/EmailHelper';
const WEB3 = require('web3');

export class BankBalanceMonitor {

    private static loggerFactory: LoggerFactory = new LoggerFactory(Config.settings.winston, Config.settings.morgan);
    private static logger: LoggerInstance = BankBalanceMonitor.loggerFactory.getInstance('BankBalanceMonitor');
    private static web3: any;

    public constructor(private networkID: number) {
        const infuraURL = `wss://${Globals.GET_NETWORK_NAME(this.networkID)}.infura.io/ws`;
        BankBalanceMonitor.web3 = new WEB3(new WEB3.providers.WebsocketProvider(infuraURL));
    }

    private async checkBalance(): Promise<any> {
        BankBalanceMonitor.logger.info('Checking Contract Balance');
        const address = (await new CreatePaymentModelHandler().getBankAddress()).bankAddress;
        const balance = await BankBalanceMonitor.web3.eth.getBalance(address);
        const threshold = BankBalanceMonitor.web3.utils.toWei(Globals.BALANCE_CHECK_THRESHOLD().toString(), 'ether');
        if ((balance - threshold) < 0) {
            BankBalanceMonitor.logger.warn('Contract Balance Low!');
            new EmailHelper().sendContractLowBalanceEmail(Config.settings.balanceNotificationEmailAddress, address);
        }
    }

    public async monitor() {
        setInterval(this.checkBalance, Globals.BALANCE_CHECK_INTERVAL());
        BankBalanceMonitor.logger.info('Monitoring Smart Contract Balance');
    }

}