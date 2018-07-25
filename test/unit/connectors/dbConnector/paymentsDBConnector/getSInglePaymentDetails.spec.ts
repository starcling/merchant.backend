import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentDbConnector } from '../../../../../src/connectors/dbConnector/paymentsDBconnector';
import { IPaymentInsertDetails, IPaymentUpdateDetails } from '../../../../../src/core/payment/models';
import { DataService, ISqlQuery } from '../../../../../src/utils/datasource/DataService';

chai.use(chaiAsPromised);
chai.should();

const dataservice = new DataService();
const paymentDbConnector = new PaymentDbConnector();

const paymentsTestData: any = require('../../../../../resources/testData.json').payments;
const testPayment: IPaymentInsertDetails = paymentsTestData['insertTestPayment'];
var testId: string;

const insertTestPayment = async () => {
    const result = await paymentDbConnector.insertPayment(testPayment);
    testId = result.data[0].id;
}

const clearTestPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payments WHERE id = $1;',
        values: [testId]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
}

describe('A paymentDbConnector', () => {
    describe('Get payment details', () => {
        beforeEach(async () => {
            await insertTestPayment();
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should retrieve the payment details for a single record', async () => {
            const result = await paymentDbConnector.getSinglePayment(testId);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('title').that.is.equal(testPayment.title);
            result.data[0].should.have.property('description').that.is.equal(testPayment.description);
            result.data[0].should.have.property('promo').that.is.equal(null);
            result.data[0].should.have.property('status').that.is.equal(1);
            result.data[0].should.have.property('customerAddress').that.is.equal(null);
            result.data[0].should.have.property('amount').that.is.equal(testPayment.amount);
            result.data[0].should.have.property('currency').that.is.equal(testPayment.currency);
            result.data[0].should.have.property('startTimestamp').that.is.equal(testPayment.startTimestamp);
            result.data[0].should.have.property('endTimestamp').that.is.equal(testPayment.endTimestamp);
            result.data[0].should.have.property('type').that.is.equal(testPayment.type);
            result.data[0].should.have.property('frequency').that.is.equal(testPayment.frequency);
            result.data[0].should.have.property('registerTxHash').that.is.equal(null);
            result.data[0].should.have.property('executeTxHash').that.is.equal(null);
            result.data[0].should.have.property('executeTxStatus').that.is.equal(1);
            result.data[0].should.have.property('debitAccount').that.is.equal(null);
            result.data[0].should.have.property('merchantAddress').that.is.equal(null);
        });
    });
});