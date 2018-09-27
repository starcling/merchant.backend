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

describe('A PaymentModelDbConnector getPaymentModelByID', () => {
    describe('With successfull request', () => {
        beforeEach(async () => {
            await insertTestPayment();
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should retrieve the paymentModel details for a single record', async () => {
            const result = await paymentDbConnector.getPaymentModelByID(testId);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('title').that.is.equal(testPaymentModel.title);
            result.data[0].should.have.property('description').that.is.equal(testPaymentModel.description);
            result.data[0].should.have.property('amount').that.is.equal(String(testPaymentModel.amount));
            result.data[0].should.have.property('currency').that.is.equal(testPaymentModel.currency);
            result.data[0].should.have.property('typeID').that.is.equal(testPaymentModel.typeID);
            result.data[0].should.have.property('frequency').that.is.equal(testPaymentModel.frequency);
        });
    });
});