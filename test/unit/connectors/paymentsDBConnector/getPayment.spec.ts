import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { IPaymentInsertDetails } from '../../../../src/core/payment/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { MerchantSDK } from '../../../../src/core/MerchantSDK';

chai.use(chaiAsPromised);
chai.should();

const dataservice = new DataService();
const paymentDbConnector = new PaymentDbConnector();

const paymentsTestData: any = require('../../../../resources/testData.json').payments;
const testPayment: IPaymentInsertDetails = paymentsTestData['insertTestPayment'];
var testId: string;

const insertTestPayment = async () => {
    const result = await paymentDbConnector.createPayment(testPayment);
    testId = result.data[0].id;
};

const clearTestPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payments WHERE id = $1;',
        values: [testId]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A PaymentDbConnector getPayment', () => {
    describe('With successfull request', () => {
        before(() => {
            MerchantSDK.GET_SDK().build({
                getPayment: paymentDbConnector.getPayment
            });
        });
        after(() => {
            MerchantSDK.GET_SDK().disconnectRedis();
        });
        beforeEach(async () => {
            await insertTestPayment();
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should retrieve the payment details for a single record', async () => {
            const result = await paymentDbConnector.getPayment(testId);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('title').that.is.equal(testPayment.title);
            result.data[0].should.have.property('description').that.is.equal(testPayment.description);
            result.data[0].should.have.property('promo').that.is.equal(null);
            result.data[0].should.have.property('amount').that.is.equal(testPayment.amount);
            result.data[0].should.have.property('currency').that.is.equal(testPayment.currency);
            result.data[0].should.have.property('typeID').that.is.equal(testPayment.typeID);
            result.data[0].should.have.property('frequency').that.is.equal(testPayment.frequency);
        });
        it('Should retrieve the payment details for a single record', async () => {
            const result = await MerchantSDK.GET_SDK().getPayment(testId);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('title').that.is.equal(testPayment.title);
            result.data[0].should.have.property('description').that.is.equal(testPayment.description);
            result.data[0].should.have.property('promo').that.is.equal(null);
            result.data[0].should.have.property('amount').that.is.equal(testPayment.amount);
            result.data[0].should.have.property('currency').that.is.equal(testPayment.currency);
            result.data[0].should.have.property('typeID').that.is.equal(testPayment.typeID);
            result.data[0].should.have.property('frequency').that.is.equal(testPayment.frequency);
        });
    });
});