import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentModelDbConnector } from '../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { IPaymentModelInsertDetails } from '../../../../src/core/paymentModel/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { MerchantSDK } from '../../../../src/core/MerchantSDK';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { Globals } from '../../../../src/utils/globals';

chai.use(chaiAsPromised);
chai.should();

const paymentDbConnector = new PaymentDbConnector();
const paymentModelDbConnector = new PaymentModelDbConnector();
const dataservice = new DataService();

const payments: any = require('../../../../resources/testData.json').payments;
const paymentModels: any = require('../../../../resources/testData.json').paymentModels;

const testInsertPayment = payments['insertTestPayment'];
const testUpdatePayment = payments['updateTestPayment'];
const testInsertPaymentModel: IPaymentModelInsertDetails = paymentModels['insertTestPaymentModel'];

const insertTestPaymentModel = async () => {
    const result = await paymentModelDbConnector.createPaymentModel(testInsertPaymentModel);
    testInsertPayment.pullPaymentModelID = result.data[0].id;
};

const clearTestPaymentModel = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payment_models WHERE id = $1;',
        values: [testInsertPayment.pullPaymentModelID]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A PaymentModelDbConnector getPaymentByID', () => {
    describe('With successfull request', () => {
        before(() => {
            MerchantSDK.GET_SDK().build({
                getPullPayment: paymentDbConnector.getPaymentByID
            });
        });
        after(() => {
            MerchantSDK.GET_SDK().disconnectRedis();
        });
        beforeEach(async () => {
            await insertTestPaymentModel();
            const result = await paymentDbConnector.createPayment(testInsertPayment);
            testUpdatePayment.id = result.data[0].id;
        });
        afterEach(async () => {
            await clearTestPaymentModel();
        });
        it('Should retrieve the payment details for a single record', async () => {
            await Globals.REFRESH_ENUMS();

            const contractStatuses = Globals.GET_PAYMENT_STATUS_ENUM();
            const paymentTypes = Globals.GET_PAYMENT_TYPE_ENUM();

            const result = await paymentDbConnector.getPaymentByID(testUpdatePayment.id);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('title').that.is.equal(testInsertPaymentModel.title);
            result.data[0].should.have.property('description').that.is.equal(testInsertPaymentModel.description);
            result.data[0].should.have.property('amount').that.is.equal(testInsertPaymentModel.amount);
            result.data[0].should.have.property('initialPaymentAmount').that.is.equal(testInsertPaymentModel.initialPaymentAmount);
            result.data[0].should.have.property('currency').that.is.equal(testInsertPaymentModel.currency);
            result.data[0].should.have.property('numberOfPayments').that.is.equal(testInsertPayment.numberOfPayments);
            result.data[0].should.have.property('frequency').that.is.equal(testInsertPaymentModel.frequency);
            result.data[0].should.have.property('type').that.is.equal(paymentTypes[testInsertPaymentModel.typeID]);
            result.data[0].should.have.property('status').that.is.equal(contractStatuses[1]);
            result.data[0].should.have.property('networkID').that.is.equal(testInsertPaymentModel.networkID);
            result.data[0].should.have.property('nextPaymentDate').that.is.equal(testInsertPayment.nextPaymentDate.toString());
            result.data[0].should.have.property('lastPaymentDate').that.is.equal('0');
            result.data[0].should.have.property('startTimestamp').that.is.equal(testInsertPayment.startTimestamp.toString());
            result.data[0].should.have.property('pullPaymentAddress').that.is.equal(testInsertPayment.pullPaymentAddress);
            result.data[0].should.have.property('userID').that.is.equal(testInsertPayment.userID);
        });
        it('Should retrieve the payment details for a single record', async () => {
            await Globals.REFRESH_ENUMS();

            const contractStatuses = Globals.GET_PAYMENT_STATUS_ENUM();
            const paymentTypes = Globals.GET_PAYMENT_TYPE_ENUM();

            const result = await MerchantSDK.GET_SDK().getPullPayment(testUpdatePayment.id);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('title').that.is.equal(testInsertPaymentModel.title);
            result.data[0].should.have.property('description').that.is.equal(testInsertPaymentModel.description);
            result.data[0].should.have.property('amount').that.is.equal(testInsertPaymentModel.amount);
            result.data[0].should.have.property('initialPaymentAmount').that.is.equal(testInsertPaymentModel.initialPaymentAmount);
            result.data[0].should.have.property('currency').that.is.equal(testInsertPaymentModel.currency);
            result.data[0].should.have.property('numberOfPayments').that.is.equal(testInsertPayment.numberOfPayments);
            result.data[0].should.have.property('frequency').that.is.equal(testInsertPaymentModel.frequency);
            result.data[0].should.have.property('type').that.is.equal(paymentTypes[testInsertPaymentModel.typeID]);
            result.data[0].should.have.property('status').that.is.equal(contractStatuses[1]);
            result.data[0].should.have.property('networkID').that.is.equal(testInsertPaymentModel.networkID);
            result.data[0].should.have.property('nextPaymentDate').that.is.equal(testInsertPayment.nextPaymentDate.toString());
            result.data[0].should.have.property('lastPaymentDate').that.is.equal('0');
            result.data[0].should.have.property('startTimestamp').that.is.equal(testInsertPayment.startTimestamp.toString());
            result.data[0].should.have.property('pullPaymentAddress').that.is.equal(testInsertPayment.pullPaymentAddress);
            result.data[0].should.have.property('userID').that.is.equal(testInsertPayment.userID);
        });
    });
});