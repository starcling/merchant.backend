import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentModelDbConnector } from '../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { IPaymentModelInsertDetails } from '../../../../src/core/paymentModel/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { MerchantSDK } from '../../../../src/core/MerchantSDK';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';

chai.use(chaiAsPromised);
chai.should();

const paymentDbConnector = new PaymentDbConnector();
const paymentModelDbConnector = new PaymentModelDbConnector();
const dataService = new DataService();

const payments: any = require('../../../../resources/testData.json').payments;
const paymentModels: any = require('../../../../resources/testData.json').paymentModels;

const testInsertPayment = payments['insertTestPayment'];
const testUpdatePayment = payments['updateTestPayment'];
const testInsertPaymentModel: IPaymentModelInsertDetails = paymentModels['insertTestPaymentModel'];

const insertTestPaymentModel = async () => {
    const result = await paymentModelDbConnector.createPaymentModel(testInsertPaymentModel);
    testInsertPayment.pullPaymentModelID = result.data[0].id;
    testUpdatePayment.pullPaymentModelID = result.data[0].id;

};

const clearTestPaymentModel = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payment_models WHERE id = $1;',
        values: [testInsertPayment.pullPaymentModelID]
    };
    await dataService.executeQueryAsPromise(sqlQuery);
};

describe('A PaymentModelDbConnector updatePayment', () => {
    describe('With successful request', () => {
        before(() => {
            MerchantSDK.GET_SDK().build({
                updatePullPayment: paymentDbConnector.updatePayment
            });
        });

        after(() => {
            MerchantSDK.GET_SDK().disconnectRedis();
        });
        beforeEach(async () => {
            await insertTestPaymentModel();
            const result = await paymentDbConnector.createPayment(testInsertPayment);
            testInsertPayment.id = result.data[0].id;
            testUpdatePayment.id = result.data[0].id;
        });
        afterEach(async () => {
            await clearTestPaymentModel();
        });
        it('Should return true if the record is updated', async () => {
            const result = await paymentDbConnector.updatePayment(testUpdatePayment);

            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id').that.is.equal(testUpdatePayment.id);
            result.data[0].should.have.property('hdWalletIndex').that.is.equal(testUpdatePayment.hdWalletIndex);
            result.data[0].should.have.property('pullPaymentModelID').that.is.equal(testUpdatePayment.pullPaymentModelID);
            result.data[0].should.have.property('numberOfPayments').that.is.equal(testUpdatePayment.numberOfPayments);
            result.data[0].should.have.property('nextPaymentDate').that.is.equal(testUpdatePayment.nextPaymentDate.toString());
            result.data[0].should.have.property('lastPaymentDate').that.is.equal(testUpdatePayment.lastPaymentDate.toString());
            result.data[0].should.have.property('startTimestamp').that.is.equal(testUpdatePayment.startTimestamp.toString());
            result.data[0].should.have.property('customerAddress').that.is.equal(testInsertPayment.customerAddress);
            result.data[0].should.have.property('pullPaymentAddress').that.is.equal(testInsertPayment.pullPaymentAddress);
            result.data[0].should.have.property('statusID').that.is.equal(testUpdatePayment.statusID);
            result.data[0].should.have.property('userID').that.is.equal(testUpdatePayment.userID);
        });
        it('Should return true if the record is updated', async () => {
            const result = await MerchantSDK.GET_SDK().updatePullPayment(testUpdatePayment);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id').that.is.equal(testUpdatePayment.id);
            result.data[0].should.have.property('hdWalletIndex').that.is.equal(testUpdatePayment.hdWalletIndex);
            result.data[0].should.have.property('pullPaymentModelID').that.is.equal(testInsertPayment.pullPaymentModelID);
            result.data[0].should.have.property('numberOfPayments').that.is.equal(testUpdatePayment.numberOfPayments);
            result.data[0].should.have.property('nextPaymentDate').that.is.equal(testUpdatePayment.nextPaymentDate.toString());
            result.data[0].should.have.property('lastPaymentDate').that.is.equal(testUpdatePayment.lastPaymentDate.toString());
            result.data[0].should.have.property('startTimestamp').that.is.equal(testUpdatePayment.startTimestamp.toString());
            result.data[0].should.have.property('customerAddress').that.is.equal(testInsertPayment.customerAddress);
            result.data[0].should.have.property('pullPaymentAddress').that.is.equal(testInsertPayment.pullPaymentAddress);
            result.data[0].should.have.property('statusID').that.is.equal(testUpdatePayment.statusID);
            result.data[0].should.have.property('userID').that.is.equal(testUpdatePayment.userID);
        });
    });

    describe('With unsuccessfull request', () => {
        it('Should return false if no record is found in the database', async () => {
            testUpdatePayment.id = 'e3006e22-90bb-11e8-9daa-939c9206691a';
            try {
                await paymentDbConnector.updatePayment(testUpdatePayment);
            } catch (err) {
                err.should.have.property('success').that.is.equal(false);
                err.should.have.property('status').that.is.equal(400);
                err.should.have.property('message').that.is.equal('SQL Query failed. Reason: raise_exception');
                err.should.have.property('error').that.is.an('object');
            }
        })
    })
});