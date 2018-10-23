import { ISqlQuery, DataServiceEncrypted } from '../../utils/datasource/DataServiceEncrypted';
import { AwsEncryptionService } from '../../utils/AwsHelper/AwsEncryptionService';
import { Globals } from '../../utils/globals';

export class PrivateKeysDbConnector {
    public getPrivateKey(address: string): Promise<any> {
        const sqlQuery: ISqlQuery = {
            text: 'CALL get_private_key_from_address(?)',
            values: [address]
        };

        return new Promise(async resolve => {
            const response = await new DataServiceEncrypted().executeQueryAsPromise(sqlQuery);
            if (response.success) {
                switch (Globals.GET_ENCRYPTION_MODULE()) {
                    case 'aws':
                        response.data[0]['@accountKey'] = await (new AwsEncryptionService().decrypt(response.data[0]['@accountKey']));
                        break;
                    default:
                }
            }
            resolve(response);
        });
    }

    public addAddress(address: string, pKey: string): Promise<any> {
        return new Promise(async resolve => {
            switch (Globals.GET_ENCRYPTION_MODULE()) {
                case 'aws':
                    pKey = await (new AwsEncryptionService().encrypt(pKey));
                    break;
                default:
            }
            const sqlQuery: ISqlQuery = {
                text: 'CALL add_account(?, ?)',
                values: [address, pKey]
            };
            resolve(new DataServiceEncrypted().executeQueryAsPromise(sqlQuery));
        });
    }

    public getMnemonic(mnemonicID: string): Promise<any> {
        const sqlQuery: ISqlQuery = {
            text: 'CALL get_mnemonic(?)',
            values: [mnemonicID]
        };
        return new Promise(async resolve => {
            const response = await new DataServiceEncrypted().executeQueryAsPromise(sqlQuery);
            if (response.success) {
                switch (Globals.GET_ENCRYPTION_MODULE()) {
                    case 'aws':
                        response.data[0]['mnemonic'] = await (new AwsEncryptionService().decrypt(response.data[0]['mnemonic']));
                        break;
                    default:
                }
            }
            resolve(response);
        });
    }
}
