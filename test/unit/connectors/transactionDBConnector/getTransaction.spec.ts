import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentModelDbConnector } from '../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { IPaymentModelInsertDetails } from '../../../../src/core/paymentModel/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { IPaymentInsert } from '../../../../src/core/payment/models';
import { Globals } from '../../../../src/utils/globals';
import { TransactionDbConnector } from '../../../../src/connectors/dbConnector/TransactionDbConnector';
import { ITransactionInsert, ITransactionGet } from '../../../../src/core/transaction/models';

chai.use(chaiAsPromised);
chai.should();

const contractDbConnector = new PaymentDbConnector();
const paymentDbConnector = new PaymentModelDbConnector();
const transactionDbConnector = new TransactionDbConnector();
const dataservice = new DataService();

const transactions: any = require('../../../../resources/testData.json').transactions;
const payments: any = require('../../../../resources/testData.json').payments;
const paymentModels: any = require('../../../../resources/testData.json').paymentModels;

const testGetTransaction: ITransactionGet = transactions['insertTestTransaction'];
const testInsertTransaction: ITransactionInsert = transactions['insertTestTransaction'];
const testInsertPayment: IPaymentInsert = payments['insertTestPayment'];
const testInsertPaymentModal: IPaymentModelInsertDetails = paymentModels['insertTestPaymentModel'];

const max = 1e+52;
const min = 1e+10;

const insertTestPayment = async () => {
    const result = await paymentDbConnector.createPaymentModel(testInsertPaymentModal);
    testInsertPayment.pullPaymentModelID = result.data[0].id;
};

const clearTestPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payment_models WHERE id = $1;',
        values: [testInsertPayment.pullPaymentModelID]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A TransactionDbConnector getTransaction', () => {
    describe('With successfull request', () => {
        beforeEach(async () => {
            await insertTestPayment();
            const result = await contractDbConnector.createPayment(testInsertPayment);
            testInsertTransaction.paymentID = result.data[0].id;
            testInsertTransaction.hash = ((Math.random() * max - min ) + min).toString();
            const txResult = await transactionDbConnector.createTransaction(testInsertTransaction);
            testGetTransaction.hash = txResult.data[0].hash;
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should retrieve the transaction details from DB connector', async () => {
            await Globals.REFRESH_ENUMS();

            const transactionStatuses = Globals.GET_TRANSACTION_STATUS_ENUM();
            const transactionTypes = Globals.GET_TRANSACTION_TYPE_ENUM();
            const result = await transactionDbConnector.getTransaction(testGetTransaction);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('hash').that.is.equal(testInsertTransaction.hash);
            result.data[0].should.have.property('paymentID').that.is.equal(testInsertTransaction.paymentID);
            result.data[0].should.have.property('timestamp').that.is.equal(testInsertTransaction.timestamp);
            result.data[0].should.have.property('type').that.is.equal(transactionTypes[testInsertTransaction.typeID]);
            result.data[0].should.have.property('status').that.is.equal(transactionStatuses[testInsertTransaction.statusID]);
        });

        it('Should retrieve the transaction details from SDK', async () => {
            // await Globals.REFRESH_ENUMS();

            // const contractStatuses = Globals.GET_CONTRACT_STATUS_ENUM();
            // const paymentTypes = Globals.GET_PAYMENT_TYPE_ENUM();

            // const result = await MerchantSDK.GET_SDK().getPaymentModelByID(testUpdateContract.id);
            // result.should.have.property('success').that.is.equal(true);
            // result.should.have.property('status').that.is.equal(200);
            // result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            // result.should.have.property('data').that.is.an('array');
            // result.data[0].should.have.property('id');
            // result.data[0].should.have.property('title').that.is.equal(testInsertPayment.title);
            // result.data[0].should.have.property('description').that.is.equal(testInsertPayment.description);
            // result.data[0].should.have.property('amount').that.is.equal(testInsertPayment.amount);
            // result.data[0].should.have.property('initialPaymentAmount').that.is.equal(testInsertPayment.initialPaymentAmount);
            // result.data[0].should.have.property('currency').that.is.equal(testInsertPayment.currency);
            // result.data[0].should.have.property('numberOfPayments').that.is.equal(testInsertContract.numberOfPayments);
            // result.data[0].should.have.property('frequency').that.is.equal(testInsertPayment.frequency);
            // result.data[0].should.have.property('type').that.is.equal(paymentTypes[testInsertPayment.typeID]);
            // result.data[0].should.have.property('status').that.is.equal(contractStatuses[testInsertContract.statusID]);
            // result.data[0].should.have.property('networkID').that.is.equal(testInsertPayment.networkID);
            // result.data[0].should.have.property('nextPaymentDate').that.is.equal(testInsertContract.nextPaymentDate.toString());
            // result.data[0].should.have.property('lastPaymentDate').that.is.equal(testInsertContract.lastPaymentDate.toString());
            // result.data[0].should.have.property('startTimestamp').that.is.equal(testInsertContract.startTimestamp.toString());
            // result.data[0].should.have.property('pullPaymentAddress').that.is.equal(testInsertContract.pullPaymentAddress);
            // result.data[0].should.have.property('userID').that.is.equal(testInsertContract.userID);
        });
    });

    describe('With unsuccessfull request', () => {
        it('Should raise not found error', async () => {
            const tempGetTransaction = Object.assign({}, testGetTransaction);
            tempGetTransaction.hash = 'BAD_HASH'
            try {
                await transactionDbConnector.getTransaction(testGetTransaction);
            } catch (err) {
                err.should.have.property('success').that.is.equal(false);
                err.should.have.property('status').that.is.equal(400);
                err.should.have.property('message').that.is.equal('SQL Query failed. Reason: raise_exception');
                err.should.have.property('error').that.is.an('object');
            }
        });
    });
});