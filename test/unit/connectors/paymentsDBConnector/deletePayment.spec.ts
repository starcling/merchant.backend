import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentModelDbConnector } from '../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { IPaymentModelInsertDetails } from '../../../../src/core/paymentModel/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';

chai.use(chaiAsPromised);
chai.should();

const dataservice = new DataService();
const paymentDbConnector = new PaymentModelDbConnector();

const paymentModelsTestData: any = require('../../../../resources/testData.json').paymentModels;
const testPaymentModel: IPaymentModelInsertDetails = paymentModelsTestData['insertTestPaymentModel'];

let testId: string;

const insertTestPayment = async () => {
  const result = await paymentDbConnector.createPaymentModel(testPaymentModel);
  testId = result.data[0].id;
};

const clearTestPayment = async () => {
  const sqlQuery: ISqlQuery = {
    text: 'DELETE FROM public.tb_payment_models WHERE id = $1;',
    values: [testId]
  };
  await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A PaymentModelDbConnector deletePaymentModel', () => {
  describe('With successfull request', () => {
    beforeEach(async () => {
      await insertTestPayment();
    });
    afterEach(async () => {
      await clearTestPayment();
    });
    it('Should delete paymentModel details from a database', async () => {
      const result = await paymentDbConnector.deletePaymentModel(testId);
      result.should.have.property('success').that.is.equal(true);
      result.should.have.property('status').that.is.equal(200);
      result.should.have.property('message').that.is.equal('SQL Query completed successful.');
    });
  });
});