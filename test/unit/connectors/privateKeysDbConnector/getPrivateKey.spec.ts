import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PrivateKeysDbConnector } from '../../../../src/connectors/dbConnector/PrivateKeysDbConnector';
import { DataServiceEncrypted, ISqlQuery } from '../../../../src/utils/datasource/DataServiceEncrypted';

chai.use(chaiAsPromised);
chai.should();

const dataservice = new DataServiceEncrypted();
const privateKeysDbConnector = new PrivateKeysDbConnector();
const testAccount = 'testAccount';
const testPrivateKey = 'testPrivateKey';

const insertTestAccount = async () => {
  const sqlQuery: ISqlQuery = {
    text: 'insert into account (address, privateKey) values(?, ?)',
    values: [testAccount, testPrivateKey]
  };

  await new DataServiceEncrypted().executeQueryAsPromise(sqlQuery);
};

const clearTestAccount = async () => {
  const sqlQuery: ISqlQuery = {
    text: 'DELETE FROM account WHERE address = ?;',
    values: [testAccount]
  };
  await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A DataServiceEncrypted getPrivateKey', () => {
  describe('With successfull request', () => {
    beforeEach(async () => {
      await insertTestAccount();
    });
    afterEach(async () => {
      await clearTestAccount();
    });
    it('Should retrieve the private key for provided account', async () => {
      const result = await privateKeysDbConnector.getPrivateKey(testAccount);
      result.should.have.property('success').that.is.equal(true);
      result.should.have.property('status').that.is.equal(200);
      result.should.have.property('message').that.is.equal('SQL Query completed successful.');
      result.should.have.property('data').that.is.an('array');
      result.data[0].should.have.property('@accountKey').that.is.equal(testPrivateKey);
    });
  });

  describe('With no data', () => {
    beforeEach(async () => {
      await insertTestAccount();
    });
    afterEach(async () => {
      await clearTestAccount();
    });
    it('Should get no data available response', async () => {
      const result = await privateKeysDbConnector.getPrivateKey('account');
      result.should.have.property('success').that.is.equal(false);
      result.should.have.property('status').that.is.equal(400);
    });
  });
});