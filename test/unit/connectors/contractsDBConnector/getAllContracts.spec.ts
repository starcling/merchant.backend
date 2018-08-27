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

describe('A paymentDbConnector', () => {
    describe('Get all payment details', () => {
        before(() => {
            MerchantSDK.GET_SDK().build({
                getAllPayments: paymentDbConnector.getAllPayments
            });
        })

        after(() => {
            MerchantSDK.GET_SDK().disconnectRedis();
        })
        beforeEach(async () => {
            await insertTestPayment();
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should retrieve the payment details for all records', async () => {
            const result = await paymentDbConnector.getAllPayments();
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
        });
        it('Should retrieve the payment details for all records', async () => {
            const result = await MerchantSDK.GET_SDK().getAllPayments();
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
        });
    });
});