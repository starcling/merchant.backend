import { DataServiceEncrypted } from "../../../../src/utils/datasource/DataServiceEncrypted";

import { ISqlQuery } from "../../../../src/utils/datasource/DataService";

export const addTestMnemonic = async (mnemonicID) => {
    process.env.KEY_DB_HOST = 'localhost';
    process.env.KEY_DB_PORT = '3305';
    process.env.KEY_DB_USER = 'db_service';
    process.env.KEY_DB_PASSWORD = 'db_pass';
    process.env.KEY_DB_DATABASE = 'keys';

    const dataservice = new DataServiceEncrypted();

    const TEST_MNEMONIC = 'payment test test test test test test test test test test test test test test';

    const sqlQueryInsert: ISqlQuery = {
        text: 'call add_mnemonic(?, ?, ?)',
        values: [mnemonicID, TEST_MNEMONIC, 'sUp4hS3cr37kE9c0D3']
    }
    await dataservice.executeQueryAsPromise(sqlQueryInsert);
}

export const removeTestMnemonic = async (mnemonicID) => {
    process.env.KEY_DB_HOST = 'localhost';
    process.env.KEY_DB_PORT = '3305';
    process.env.KEY_DB_USER = 'db_service';
    process.env.KEY_DB_PASSWORD = 'db_pass';
    process.env.KEY_DB_DATABASE = 'keys';

    const dataservice = new DataServiceEncrypted();

    const sqlQueryDelete: ISqlQuery = {
        text: 'delete from mnemonics where id = ?',
        values: [mnemonicID]
    };
    await dataservice.executeQueryAsPromise(sqlQueryDelete);
}