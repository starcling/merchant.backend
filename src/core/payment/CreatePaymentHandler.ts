import { MnemonicRetriever } from '../hd-wallet/MnemonicRetriever';
import { DefaultConfig } from '../../config/default.config';
import { HdWallet } from '../hd-wallet/HdWallet';
import { PrivateKeysDbConnector } from '../../connectors/dbConnector/PrivateKeysDbConnector';
import * as redis from 'redis';
import * as bluebird from 'bluebird';

export class CreatePaymentHandler {
    public async handle(): Promise<NewPaymentHdWalletDetails> {
        let redisClient, redisClientBlocking;
        redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST); // this creates a new client
        redisClientBlocking = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST); // this creates a new client
        bluebird.promisifyAll(redis);
        const MERHCANT_PAYMENT_INDEX: string = 'k_merchant_payment_index';
        const testRedis = await redisClient.getAsync(MERHCANT_PAYMENT_INDEX);
        if (!testRedis) {
            await redisClient.setAsync(MERHCANT_PAYMENT_INDEX, 1);
        }

        try {
            let mnemonic: string = await new MnemonicRetriever().retrieve(DefaultConfig.settings.mnemonicID);
            console.debug('mnemonic....', mnemonic);
            if (!mnemonic) {
                redisClient.unref();
                redisClientBlocking.unref();
                setTimeout(() => {
                    this.handle();
                }, 1000);

                return;
            }
            let hdWallet = new HdWallet(mnemonic);

            mnemonic = null;
            const index = Number(await redisClient.getAsync(MERHCANT_PAYMENT_INDEX));
            await redisClient.setAsync(MERHCANT_PAYMENT_INDEX, index + 1);
            let privateKey: string = hdWallet.getPrivateKeyAtIndex(index).slice(2);
            const address: string = hdWallet.getAddressAtIndex(index);
            const bankAddress: string = hdWallet.getAddressAtIndex(0);
            hdWallet = null;
            await new PrivateKeysDbConnector().addAddress(address, privateKey);
            privateKey = null;
            redisClient.unref();
            redisClientBlocking.unref();
            return <NewPaymentHdWalletDetails>{
                index: index,
                address: address,
                bankAddress: bankAddress
            };
        } catch (err) {
            redisClient.unref();
            redisClientBlocking.unref();

            return <NewPaymentHdWalletDetails>{
                index: null,
                address: null
            };
        }
    }

    public async storeBankKey() {
        try {
            let mnemonic: string = await new MnemonicRetriever().retrieve(DefaultConfig.settings.mnemonicID);
            console.debug('mnemonic....', mnemonic);
            if (!mnemonic) {
                setTimeout(() => {
                    this.storeBankKey();
                }, 1000);

                return;
            }
            let hdWallet = new HdWallet(mnemonic);

            mnemonic = null;
            const bankAddress: string = hdWallet.getAddressAtIndex(0);
            let bankPrivateKey: string = hdWallet.getPrivateKeyAtIndex(0).slice(2);
            hdWallet = null;
            await new PrivateKeysDbConnector().addAddress(bankAddress, bankPrivateKey);
            bankPrivateKey = null;
        } catch (err) {
            console.debug(err);
        }
    }

    public async getBankAddress() {
        try {
            let mnemonic: string = await new MnemonicRetriever().retrieve(DefaultConfig.settings.mnemonicID);
            if (!mnemonic) {
                setTimeout(() => {
                    this.getBankAddress();
                }, 1000);

                return;
            }
            let hdWallet = new HdWallet(mnemonic);

            mnemonic = null;
            const bankAddress: string = hdWallet.getAddressAtIndex(0);
            hdWallet = null;
            return <NewPaymentHdWalletDetails>{
                bankAddress: bankAddress
            };
        } catch (err) {
            console.debug(err);
        }
    }

}

export interface NewPaymentHdWalletDetails {
    index: number;
    address: string;
    bankAddress: string;
}