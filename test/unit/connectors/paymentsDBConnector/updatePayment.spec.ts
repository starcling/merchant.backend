import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentDbConnector } from '../../../../src/connectors/api/v1/dbConnector/PaymentDbConnector';
import { IPaymentInsertDetails, IPaymentUpdateDetails } from '../../../../src/core/payment/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { MerchantSDK } from '../../../../src/core/MerchantSDK';

chai.use(chaiAsPromised);
chai.should();

const dataservice = new DataService();
const paymentDbConnector = new PaymentDbConnector();

const paymentsTestData: any = require('../../../../resources/testData.json').payments;
const testPayment: IPaymentInsertDetails = paymentsTestData['insertTestPayment'];
const updateTestPayment: IPaymentUpdateDetails = paymentsTestData['updateTestPayment'];

const insertTestPayment = async () => {
    const result = await paymentDbConnector.createPayment(testPayment);
    updateTestPayment.id = result.data[0].id;
};

const clearTestPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payments WHERE id = $1;',
        values: [updateTestPayment.id]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('PaymentDbConnector', () => {
    describe('Update payment record', () => {
        before(() => {
            MerchantSDK.GET_SDK().build({
                updatePayment: paymentDbConnector.updatePayment
            });
        })

        after(() => {
            MerchantSDK.GET_SDK().disconnectRedis();
        });
        beforeEach(async () => {
            await insertTestPayment();
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should return true if the record is updated', async () => {
            const result = await paymentDbConnector.updatePayment(updateTestPayment);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id').that.is.equal(updateTestPayment.id);
            result.data[0].should.have.property('title').that.is.equal(updateTestPayment.title);
            result.data[0].should.have.property('description').that.is.equal(updateTestPayment.description);
            result.data[0].should.have.property('promo').that.is.equal(updateTestPayment.promo);
            result.data[0].should.have.property('status').that.is.equal(updateTestPayment.status);
            result.data[0].should.have.property('customerAddress').that.is.equal(updateTestPayment.customerAddress);
            result.data[0].should.have.property('amount').that.is.equal(updateTestPayment.amount);
            result.data[0].should.have.property('currency').that.is.equal(updateTestPayment.currency);
            result.data[0].should.have.property('startTimestamp').that.is.equal(updateTestPayment.startTimestamp);
            result.data[0].should.have.property('endTimestamp').that.is.equal(updateTestPayment.endTimestamp);
            result.data[0].should.have.property('type').that.is.equal(updateTestPayment.type);
            result.data[0].should.have.property('frequency').that.is.equal(updateTestPayment.frequency);
            result.data[0].should.have.property('registerTxHash').that.is.equal(updateTestPayment.registerTxHash);
            result.data[0].should.have.property('executeTxHash').that.is.equal(updateTestPayment.executeTxHash);
            result.data[0].should.have.property('executeTxStatus').that.is.equal(updateTestPayment.executeTxStatus);
            result.data[0].should.have.property('merchantAddress').that.is.equal(updateTestPayment.merchantAddress);
            result.data[0].should.have.property('userId').that.is.equal(updateTestPayment.userId);
        });
        it('Should return true if the record is updated', async () => {
            const result = await MerchantSDK.GET_SDK().updatePayment(updateTestPayment);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id').that.is.equal(updateTestPayment.id);
            result.data[0].should.have.property('title').that.is.equal(updateTestPayment.title);
            result.data[0].should.have.property('description').that.is.equal(updateTestPayment.description);
            result.data[0].should.have.property('promo').that.is.equal(updateTestPayment.promo);
            result.data[0].should.have.property('status').that.is.equal(updateTestPayment.status);
            result.data[0].should.have.property('customerAddress').that.is.equal(updateTestPayment.customerAddress);
            result.data[0].should.have.property('amount').that.is.equal(updateTestPayment.amount);
            result.data[0].should.have.property('currency').that.is.equal(updateTestPayment.currency);
            result.data[0].should.have.property('startTimestamp').that.is.equal(updateTestPayment.startTimestamp);
            result.data[0].should.have.property('endTimestamp').that.is.equal(updateTestPayment.endTimestamp);
            result.data[0].should.have.property('type').that.is.equal(updateTestPayment.type);
            result.data[0].should.have.property('frequency').that.is.equal(updateTestPayment.frequency);
            result.data[0].should.have.property('registerTxHash').that.is.equal(updateTestPayment.registerTxHash);
            result.data[0].should.have.property('executeTxHash').that.is.equal(updateTestPayment.executeTxHash);
            result.data[0].should.have.property('executeTxStatus').that.is.equal(updateTestPayment.executeTxStatus);
            result.data[0].should.have.property('merchantAddress').that.is.equal(updateTestPayment.merchantAddress);
            result.data[0].should.have.property('userId').that.is.equal(updateTestPayment.userId);
        });
    });

    describe('Update non existing payment record', () => {
        it('Should return false if no record is found in the database', async () => {
            updateTestPayment.id = 'e3006e22-90bb-11e8-9daa-939c9206691a';
            const result = await paymentDbConnector.updatePayment(updateTestPayment);
            result.should.have.property('success').that.is.equal(false);
            result.should.have.property('status').that.is.equal(400);
            result.should.have.property('message').that.is.equal('No record found with provided id.');
        })
    })
});