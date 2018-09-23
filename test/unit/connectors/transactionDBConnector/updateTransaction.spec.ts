import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentModelDbConnector } from '../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { IPaymentModelInsertDetails } from '../../../../src/core/paymentModel/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { TransactionDbConnector } from '../../../../src/connectors/dbConnector/TransactionDbConnector';
import { IPaymentUpdate, IPaymentInsert } from '../../../../src/core/payment/models';
import { ITransactionInsert, ITransactionUpdate } from '../../../../src/core/transaction/models';

chai.use(chaiAsPromised);
chai.should();

const contractDbConnector = new PaymentDbConnector();
const paymentDbConnector = new PaymentModelDbConnector();
const transactionDbConnector = new TransactionDbConnector();
const dataservice = new DataService();

const transactions: any = require('../../../../resources/testData.json').transactions;
const payments: any = require('../../../../resources/testData.json').payments;
const paymentModels: any = require('../../../../resources/testData.json').paymentModels;

const testInsertTransaction: ITransactionInsert = transactions['insertTestTransaction'];
const testUpdateTransaction: ITransactionUpdate = transactions['updateTestTransaction'];
const testInsertPayment: IPaymentInsert = payments['insertTestPayment'];
const testUpdatePayment: IPaymentUpdate = payments['updateTestPayment'];
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

describe('A TransactionDbConnector updateTransaction', () => {
    describe('With successfull request', () => {
        beforeEach(async () => {
            await insertTestPayment();
            const result = await contractDbConnector.createPayment(testInsertPayment);
            testUpdatePayment.id = result.data[0].id;
            testInsertTransaction.paymentID = result.data[0].id;
            testInsertTransaction.hash = ((Math.random() * max - min) + min).toString();
            const txResult = await transactionDbConnector.createTransaction(testInsertTransaction);
            testUpdateTransaction.hash = txResult.data[0].hash;
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should return true if the record is updated from DB connector', async () => {
            const result = await transactionDbConnector.updateTransaction(testUpdateTransaction);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('hash').that.is.equal(testInsertTransaction.hash);
            result.data[0].should.have.property('typeID').that.is.equal(testInsertTransaction.typeID);
            result.data[0].should.have.property('statusID').that.is.equal(testUpdateTransaction.statusID);
            result.data[0].should.have.property('paymentID').that.is.equal(testInsertTransaction.paymentID);
            result.data[0].should.have.property('timestamp').that.is.equal(testInsertTransaction.timestamp);
        });
        it('Should return true if the record is updated from SDK', async () => {
            // TODO: Reflect changes on the SDK and pass correct method
            // const result = await MerchantSDK.GET_SDK().updatePaymentModel(testUpdateContract);
            // result.should.have.property('success').that.is.equal(true);
            // result.should.have.property('status').that.is.equal(200);
            // result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            // result.should.have.property('data').that.is.an('array');
            // result.data[0].should.have.property('id').that.is.equal(testUpdateContract.id);
            // result.data[0].should.have.property('hdWalletIndex').that.is.equal(testUpdateContract.hdWalletIndex);
            // result.data[0].should.have.property('pullPaymentModelID').that.is.equal(testInsertContract.pullPaymentModelID);
            // result.data[0].should.have.property('numberOfPayments').that.is.equal(testUpdateContract.numberOfPayments);
            // result.data[0].should.have.property('nextPaymentDate').that.is.equal(testUpdateContract.nextPaymentDate.toString());
            // result.data[0].should.have.property('lastPaymentDate').that.is.equal(testUpdateContract.lastPaymentDate.toString());
            // result.data[0].should.have.property('startTimestamp').that.is.equal(testUpdateContract.startTimestamp.toString());
            // result.data[0].should.have.property('customerAddress').that.is.equal(testInsertContract.customerAddress);
            // result.data[0].should.have.property('pullPaymentAddress').that.is.equal(testInsertContract.pullPaymentAddress);
            // result.data[0].should.have.property('statusID').that.is.equal(testUpdateContract.statusID);
            // result.data[0].should.have.property('userID').that.is.equal(testUpdateContract.userID);
        });
    });

    describe('With unsuccessfull request', () => {

        it('Should return false if no statusID provided', async () => {
            const tempUpdateTransaction = {...testUpdateTransaction};
            delete tempUpdateTransaction.statusID;
            try {
                await transactionDbConnector.updateTransaction(tempUpdateTransaction);
            } catch (err) {
                err.should.have.property('success').that.is.equal(false);
                err.should.have.property('status').that.is.equal(400);
                err.should.have.property('message').that.is.equal('SQL Query failed. Reason: raise_exception');
            }
        });

        it('Should return false if id is in wrong format', async () => {
            const tempUpdateTransaction = {...testUpdateTransaction};
            tempUpdateTransaction.hash = 'BAD_ID';
            try {
                await transactionDbConnector.updateTransaction(tempUpdateTransaction);
            } catch (err) {
                err.should.have.property('success').that.is.equal(false);
                err.should.have.property('status').that.is.equal(400);
                err.should.have.property('message').that.is.equal('SQL Query failed. Reason: raise_exception');
            }
        })

        it('Should return false if no record is found in the database', async () => {
            const tempUpdateTransaction = {...testUpdateTransaction};
            tempUpdateTransaction.hash = 'e3006e22-90bb-11e8-9daa-939c9206691a';
            try {
                await transactionDbConnector.updateTransaction(tempUpdateTransaction);
            } catch (err) {
                err.should.have.property('success').that.is.equal(false);
                err.should.have.property('status').that.is.equal(400);
                err.should.have.property('message').that.is.equal('SQL Query failed. Reason: raise_exception');
            }
        })
    })
});