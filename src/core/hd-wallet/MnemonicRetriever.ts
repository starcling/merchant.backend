import { PrivateKeysDbConnector } from '../../connectors/dbConnector/PrivateKeysDbConnector';
import { AwsEncryptionService } from '../../utils/AwsHelper/AwsEncryptionService';
export class MnemonicRetriever {
    public async retrieve(mnemonicID: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const result = await new PrivateKeysDbConnector().getMnemonic(mnemonicID);

            if (result && !result.success) {
                return reject(result.message);
            }

            const mnemonic = result.data[0].mnemonic;

            if (process.env.NODE_ENV !== 'development' && process.env.AWS_SECRET_ACCESS_KEY) {
                const decryptedMnemonic = await new AwsEncryptionService().decrypt(mnemonic);

                return resolve(decryptedMnemonic);
            }

            return resolve(mnemonic);
        });
    }
}
