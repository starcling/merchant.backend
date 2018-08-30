import { ISqlQuery, DataServiceEncrypted } from '../../utils/datasource/DataServiceEncrypted';
import { DefaultConfig } from '../../config/default.config';

export class PrivateKeysDbConnector {
    public getPrivateKey(address: string): Promise<any> {
        const sqlQuery: ISqlQuery = {
            text: 'CALL get_private_key_from_address(?, ?)',
            values: [address, DefaultConfig.settings.serverSecret]
        };

        return new DataServiceEncrypted().executeQueryAsPromise(sqlQuery);
    }

    public addAddress(address: string, pKey: string): Promise<any> {
        const sqlQuery: ISqlQuery = {
            text: 'CALL add_account(?, ?, ?)',
            values: [address, pKey, DefaultConfig.settings.serverSecret]
        };

        return new DataServiceEncrypted().executeQueryAsPromise(sqlQuery);
    }
}
