import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentModelDbConnector } from '../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { IPaymentModelInsertDetails } from '../../../../src/core/paymentModel/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { IPaymentInsert, IPaymentUpdate } from '../../../../src/core/payment/models';

chai.use(chaiAsPromised);
chai.should();

const contractDbConnector = new PaymentDbConnector();
const paymentDbConnector = new PaymentModelDbConnector();
const dataservice = new DataService();

const payments: any = require('../../../../resources/testData.json').payments;
const paymentModels: any = require('../../../../resources/testData.json').paymentModels;

const testInsertPayment: IPaymentInsert = payments['insertTestPayment'];
const testUpdatePayment: IPaymentUpdate = payments['updateTestPayment'];
const testInsertPaymentModel: IPaymentModelInsertDetails = paymentModels['insertTestPaymentModel'];

const insertTestPayment = async () => {
  const result = await paymentDbConnector.createPaymentModel(testInsertPaymentModel);
  testInsertPayment.paymentModelID = result.data[0].id;
};

const clearTestPaymentModel = async () => {
  const sqlQuery: ISqlQuery = {
    text: 'DELETE FROM public.tb_payment_models WHERE id = $1;',
    values: [testInsertPayment.paymentModelID]
  };
  await dataservice.executeQueryAsPromise(sqlQuery);
};

const clearTestPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payments WHERE id = $1;',
        values: [testUpdatePayment.id]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A PaymentDbConnector deletePayment', () => {
  describe('With successfull request', () => {
    beforeEach(async () => {
      await insertTestPayment();
      const result = await contractDbConnector.createPayment(testInsertPayment);
      testUpdatePayment.id = result.data[0].id;
    });
    afterEach(async () => {
      await clearTestPaymentModel();
    });
    afterEach(async () =>{
        await clearTestPayment();
    });
    it('Should delete payment from a database', async () => {
      const result = await contractDbConnector.deletePayment(testUpdatePayment.id);
      result.should.have.property('success').that.is.equal(true);
      result.should.have.property('status').that.is.equal(200);
      result.should.have.property('message').that.is.equal('SQL Query completed successful.');
    });
  });
});