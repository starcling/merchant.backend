import { PrivateKeysDbConnector } from '../../connectors/dbConnector/PrivateKeysDbConnector';

export class MnemonicRetriever {
    public async retrieve(mnemonicID: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const result = await new PrivateKeysDbConnector().getMnemonic(mnemonicID);

            if (result && !result.success) {
                return reject(result.message);
            }

            const mnemonic = result.data[0].mnemonic;

            return resolve(mnemonic);
        });
    }
}
