import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { IPaymentInsertDetails } from '../../../../src/core/payment/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { MerchantSDK } from '../../../../src/core/MerchantSDK';
import { ContractDbConnector } from '../../../../src/connectors/dbConnector/ContractDbConnector';
import { IPaymentContractInsert, IPaymentContractUpdate } from '../../../../src/core/contract/models';

chai.use(chaiAsPromised);
chai.should();

const contractDbConnector = new ContractDbConnector();
const paymentDbConnector = new PaymentDbConnector();
const dataservice = new DataService();
const contracts: any = require('../../../../resources/testData.json').contracts;
const payments: any = require('../../../../resources/testData.json').payments;

const testInsertContract: IPaymentContractInsert = contracts['insertTestContract'];
const testUpdateContract: IPaymentContractUpdate = contracts['updateTestContract'];
const testInsertPayment: IPaymentInsertDetails = payments['insertTestPayment'];

const insertTestPayment = async () => {
  const result = await paymentDbConnector.createPayment(testInsertPayment);
  testInsertContract.paymentID = result.data[0].id;
};

const clearTestPayment = async () => {
  const sqlQuery: ISqlQuery = {
    text: 'DELETE FROM public.tb_payments WHERE id = $1;',
    values: [testInsertContract.paymentID]
  };
  await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A ContractDbConnector deleteContract', () => {
  describe('With successfull request', () => {
    before(() => {
      MerchantSDK.GET_SDK().build({
        deletePayment: contractDbConnector.deleteContract
      });
    })
    after(() => {
      MerchantSDK.GET_SDK().disconnectRedis();
    });
    beforeEach(async () => {
      await insertTestPayment();
      const result = await contractDbConnector.createContract(testInsertContract);
      testUpdateContract.id = result.data[0].id;
    });
    afterEach(async () => {
      await clearTestPayment();
    });
    it('Should delete contract from a database', async () => {
      const result = await contractDbConnector.deleteContract(testUpdateContract.id);
      result.should.have.property('success').that.is.equal(true);
      result.should.have.property('status').that.is.equal(200);
      result.should.have.property('message').that.is.equal('SQL Query completed successful.');
    });
    it('Should delete contract from a database', async () => {
      const result = await MerchantSDK.GET_SDK().deletePayment(testUpdateContract.id);
      result.should.have.property('success').that.is.equal(true);
      result.should.have.property('status').that.is.equal(200);
      result.should.have.property('message').that.is.equal('SQL Query completed successful.');
    });
  });
});