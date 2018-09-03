import { ISqlQuery } from '../../utils/datasource/DataService';
import { DataServiceEncrypted } from '../../utils/datasource/DataServiceEncrypted';

export class MnemonicRetriever {
    public async retrieve(mnemonicID: string): Promise<any> {
        const sqlQuery: ISqlQuery = {
            text: 'call get_decrypted_mnemonic(?, ?)',
            values: [mnemonicID, 'sUp4hS3cr37kE9c0D3']
        };

        return new Promise(async (resolve, reject) => {
            const result = await new DataServiceEncrypted().executeQueryAsPromise(sqlQuery);
            if (result && !result.success) {
                return reject(result.message);
            }

            return resolve(result.data[0]['@mnemonicKey']);
        });
    }
}
