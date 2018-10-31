import * as hdKey from 'ethereumjs-wallet/hdkey';
import * as bip39 from 'bip39';

const PATH_PREFIX: string = `m/44'/60'/0'/0/`;

export class HdWallet {
    private hdWallet: any;

    public constructor(mnemonic: string) {
        let seed = bip39.mnemonicToSeed(mnemonic);
        this.hdWallet = hdKey.fromMasterSeed(seed);
        seed = null;
        mnemonic = null;
    }

    private getWalletAtIndex(index: number) {
        return this.hdWallet.derivePath(`${PATH_PREFIX}${index}`).getWallet();
    }

    public getAddressAtIndex(index: number) {
        return this.getWalletAtIndex(index).getChecksumAddressString();
    }

    public getPrivateKeyAtIndex(index: number) {
        return this.getWalletAtIndex(index).getPrivateKeyString();
    }
}
