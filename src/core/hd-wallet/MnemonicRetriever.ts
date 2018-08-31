import { ISqlQuery } from '../../utils/datasource/DataService';
import { DataServiceEncrypted } from '../../utils/datasource/DataServiceEncrypted';

export class MnemonicRetriever {
    public async retrieve(mnemonicID: string): Promise<any> {

        const sqlQuery: ISqlQuery = {
            text: 'call get_decrypted_mnemonic(?, ?)',
            values: [mnemonicID, 'merchantBackendEncrKey']
        };
        const result = await new DataServiceEncrypted().executeQueryAsPromise(sqlQuery);

        if (!result.success) {
            return null;
        }

        return result.data[0]['@mnemonicKey'];
    }
}