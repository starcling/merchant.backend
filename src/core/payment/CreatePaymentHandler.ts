import { MnemonicRetriever } from '../hd-wallet/MnemonicRetriever';
import { DefaultConfig } from '../../config/default.config';
import { HdWallet } from '../hd-wallet/HdWallet';
import { PrivateKeysDbConnector } from '../../connectors/dbConnector/PrivateKeysDbConnector';

export class CreatePaymentHandler {
    public async handle(): Promise<NewPaymentHdWalletDetails> {
        try {
            let mnemonic: string = await new MnemonicRetriever().retrieve(DefaultConfig.settings.mnemonicID);
            console.debug(mnemonic);
            let hdWallet = new HdWallet(mnemonic);
            mnemonic = null;
            // TODO: get merchant address index from redis
            const index = 0;
            let privateKey: string = hdWallet.getPrivateKeyAtIndex(index).slice(2);
            console.debug(privateKey);
            const address: string = hdWallet.getAddressAtIndex(index);
            console.debug(address);
            hdWallet = null;

            await new PrivateKeysDbConnector().addAddress(address, privateKey);
            privateKey = null;

            return <NewPaymentHdWalletDetails>{
                index: index,
                address: address
            };
        } catch (err) {
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