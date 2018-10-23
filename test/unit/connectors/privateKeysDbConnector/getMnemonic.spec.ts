import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PrivateKeysDbConnector } from '../../../../src/connectors/dbConnector/PrivateKeysDbConnector';
import { DataServiceEncrypted, ISqlQuery } from '../../../../src/utils/datasource/DataServiceEncrypted';

process.env.MERCHANT_ID = '6873da04-c31a-11e8-9d71-83d7341786f7';

chai.use(chaiAsPromised);
chai.should();

const dataservice = new DataServiceEncrypted();
const privateKeysDbConnector = new PrivateKeysDbConnector();
const mnemonicId = 'testMnemonic';
const testMnemonic = 'test test test test test test test test test';

const insertTestAccount = async () => {
  const sqlQuery: ISqlQuery = {
    text: 'insert into mnemonics (id, mnemonic) values(?, ?)',
    values: [mnemonicId, testMnemonic]
  };

  await new DataServiceEncrypted().executeQueryAsPromise(sqlQuery);
};

const clearTestAccount = async () => {
  const sqlQuery: ISqlQuery = {
    text: 'DELETE FROM mnemonics WHERE id = ?;',
    values: [mnemonicId]
  };
  await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A DataServiceEncrypted getMnemonic', () => {
  describe('With successfull request', () => {
    beforeEach(async () => {
      await insertTestAccount();
    });
    afterEach(async () => {
      //await clearTestAccount();
    });
    it('Should retrieve the mnemonic for given id', async () => {
      const result = await privateKeysDbConnector.getMnemonic(mnemonicId);
      result.should.have.property('success').that.is.equal(true);
      result.should.have.property('status').that.is.equal(200);
      result.should.have.property('message').that.is.equal('SQL Query completed successful.');
      result.should.have.property('data').that.is.an('array');
      result.data[0].should.have.property('mnemonic').that.is.equal(testMnemonic);
    });
  });

  describe('With no available mnemonic', () => {
    beforeEach(async () => {
      await insertTestAccount();
    });
    afterEach(async () => {
      await clearTestAccount();
    });
    it('Should get no data available response', async () => {
      const result = await privateKeysDbConnector.getPrivateKey('mnemonic');
      result.should.have.property('success').that.is.equal(false);
      result.should.have.property('status').that.is.equal(400);
    });
  });
});