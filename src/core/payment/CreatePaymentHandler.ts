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
        const MERHCANT_PAYMENT_INDEX: string = 'merchantPaymentIndex';
        const testRedis = await redisClient.lrangeAsync(MERHCANT_PAYMENT_INDEX, 0, -1);
        if (testRedis.length === 0) {
            await redisClient.lpushAsync(MERHCANT_PAYMENT_INDEX, 0);
        }

        try {
            let mnemonic: string = await new MnemonicRetriever().retrieve(DefaultConfig.settings.mnemonicID);
            let hdWallet = new HdWallet(mnemonic);

            mnemonic = null;
            // TODO: get merchant address index from redis
            let index = await redisClient.blpopAsync(MERHCANT_PAYMENT_INDEX, 0);
            index = Number(index[1]);
            await redisClient.lpushAsync(MERHCANT_PAYMENT_INDEX, index + 1);
            let privateKey: string = hdWallet.getPrivateKeyAtIndex(index).slice(2);
            const address: string = hdWallet.getAddressAtIndex(index);
            hdWallet = null;
            await new PrivateKeysDbConnector().addAddress(address, privateKey);
            privateKey = null;
            redisClient.unref();
            redisClientBlocking.unref();
            return <NewPaymentHdWalletDetails>{
                index: index,
                address: address
            };
        } catch (err) {
            redisClient.unref();
            redisClientBlocking.unref();
            console.debug(err);
            return <NewPaymentHdWalletDetails>{
                index: null,
                address: null
            };
        }
    }

}

export interface NewPaymentHdWalletDetails {
    index: number;
    address: string;
}