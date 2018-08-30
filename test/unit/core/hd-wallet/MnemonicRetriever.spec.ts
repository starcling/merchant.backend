import * as chai from 'chai';
import { ISqlQuery } from "../../../../src/utils/datasource/DataService";
import { DataServiceEncrypted } from "../../../../src/utils/datasource/DataServiceEncrypted";
import { MnemonicRetriever } from "../../../../src/core/hd-wallet/MnemonicRetriever";

const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

process.env.KEY_DB_HOST = 'localhost';
process.env.KEY_DB_PORT = '3306';
process.env.KEY_DB_USER = 'db_service';
process.env.KEY_DB_PASSWORD = 'db_pass';
process.env.KEY_DB_DATABASE = 'keys';

const mnemonicRetriever = new MnemonicRetriever();
const dataservice = new DataServiceEncrypted();

const TEST_MNEMONIC = 'test test test test test test test test test test test test test test';
const insertEncryptedMnemonicData = async () => {
    const sqlQuery: ISqlQuery = {
      text: 'call add_mnemonic(?, ?, ?)',
      values: ['test_mnemonic_99', TEST_MNEMONIC, 'merchantBackendEncrKey']
    }
    await dataservice.executeQueryAsPromise(sqlQuery);
  }
  
  const deleteEncryptedMnemonicData = async () => {
    const sqlQuery: ISqlQuery = {
      text: 'delete from mnemonics',
      values: []
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
  }

describe('A Mnemonic Retriever', async () => {
    beforeEach(async () => {
        await insertEncryptedMnemonicData();
      })

      afterEach(async () => {
        await deleteEncryptedMnemonicData();
      })

    it('should return mnemonic from the encrypted DB', async () => {
        const mnemonic = await mnemonicRetriever.retrieve('test_mnemonic_99');
        expect(mnemonic).to.equal(TEST_MNEMONIC);
    });
});