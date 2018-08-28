import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { IPaymentInsertDetails, IPaymentUpdateDetails } from '../../../../src/core/payment/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { MerchantSDK } from '../../../../src/core/MerchantSDK';
import { ContractDbConnector } from '../../../../src/connectors/dbConnector/ContractDbConnector';
import { TransactionDbConnector } from '../../../../src/connectors/dbConnector/TransactionDbConnector';
import { IPaymentContractUpdate, IPaymentContractInsert } from '../../../../src/core/contract/models';
import { ITransactionInsert, ITransactionUpdate } from '../../../../src/core/transaction/models';

chai.use(chaiAsPromised);
chai.should();

const contractDbConnector = new ContractDbConnector();
const paymentDbConnector = new PaymentDbConnector();
const transactionDbConnector = new TransactionDbConnector();
const dataservice = new DataService();
const transactions: any = require('../../../../resources/testData.json').transactions;
const contracts: any = require('../../../../resources/testData.json').contracts;
const payments: any = require('../../../../resources/testData.json').payments;

const testInsertTransaction: ITransactionInsert = transactions['insertTestTransaction'];
const testUpdateTransaction: ITransactionUpdate = transactions['updateTestTransaction'];
const testInsertContract: IPaymentContractInsert = contracts['insertTestContract'];
const testUpdateContract: IPaymentContractUpdate = contracts['updateTestContract'];
const testInsertPayment: IPaymentInsertDetails = payments['insertTestPayment'];


const insertTestPayment = async () => {
    const result = await paymentDbConnector.createPayment(testInsertPayment);
    testInsertContract.paymentID = result.data[0].id;
};

const clearTestPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payments WHERE id = $1;',
        values: [testInsertContract.paymentID]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A TransactionDbConnector updateTransaction', () => {
    describe('With successfull request', () => {
        before(() => {
            // MerchantSDK.GET_SDK().build({
            //     updatePayment: contractDbConnector.updateContract
            // });
        })

        after(() => {
            // MerchantSDK.GET_SDK().disconnectRedis();
        });
        beforeEach(async () => {
            await insertTestPayment();
            const result = await contractDbConnector.createContract(testInsertContract);
            testUpdateContract.id = result.data[0].id;
            testInsertTransaction.contractID = result.data[0].id;
            const txResult = await transactionDbConnector.createTransaction(testInsertTransaction);
            testUpdateTransaction.id = txResult.data[0].id;
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
            result.data[0].should.have.property('id').that.is.equal(testUpdateTransaction.id);
            result.data[0].should.have.property('hash').that.is.equal(testInsertTransaction.hash);
            result.data[0].should.have.property('typeID').that.is.equal(testInsertTransaction.typeID);
            result.data[0].should.have.property('statusID').that.is.equal(testUpdateTransaction.statusID);
            result.data[0].should.have.property('contractID').that.is.equal(testInsertTransaction.contractID);
            result.data[0].should.have.property('timestamp').that.is.equal(testInsertTransaction.timestamp);
        });
        it('Should return true if the record is updated from SDK', async () => {
            // TODO: Reflect changes on the SDK and pass correct method
            // const result = await MerchantSDK.GET_SDK().updatePayment(testUpdateContract);
            // result.should.have.property('success').that.is.equal(true);
            // result.should.have.property('status').that.is.equal(200);
            // result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            // result.should.have.property('data').that.is.an('array');
            // result.data[0].should.have.property('id').that.is.equal(testUpdateContract.id);
            // result.data[0].should.have.property('hdWalletIndex').that.is.equal(testUpdateContract.hdWalletIndex);
            // result.data[0].should.have.property('paymentID').that.is.equal(testInsertContract.paymentID);
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
            const tempUpdateTransaction = Object.assign({}, testUpdateTransaction);
            delete tempUpdateTransaction.statusID
            try {
                await transactionDbConnector.updateTransaction(tempUpdateTransaction);
            } catch (err) {
                err.should.have.property('success').that.is.equal(false);
                err.should.have.property('status').that.is.equal(400);
                err.should.have.property('message').that.is.equal('SQL Query failed. Reason: raise_exception');
            }
        })

        it('Should return false if id is in wrong format', async () => {
            const tempUpdateTransaction = Object.assign({}, testUpdateTransaction);
            tempUpdateTransaction.id = 'BAD_ID';
            try {
                await transactionDbConnector.updateTransaction(tempUpdateTransaction);
            } catch (err) {
                err.should.have.property('success').that.is.equal(false);
                err.should.have.property('status').that.is.equal(400);
                err.should.have.property('message').that.is.equal('SQL Query failed. Reason: invalid_text_representation');
            }
        })

        it('Should return false if no record is found in the database', async () => {
            const tempUpdateTransaction = Object.assign({}, testUpdateTransaction);
            tempUpdateTransaction.id = 'e3006e22-90bb-11e8-9daa-939c9206691a';
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