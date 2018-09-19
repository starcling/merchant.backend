import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentModelDbConnector } from '../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { IPaymentModelInsertDetails } from '../../../../src/core/paymentModel/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { MerchantSDK } from '../../../../src/core/MerchantSDK';
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

const numberOfTransactions = 10;
const max = 1e+52;
const min = 1e+10;

const insertTestPaymentModel = async () => {
    const result = await paymentDbConnector.createPaymentModel(testInsertPaymentModal);
    testInsertPayment.paymentModelID = result.data[0].id;
};

const clearTestPaymentModel = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payment_models WHERE id = $1;',
        values: [testInsertPayment.paymentModelID]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A TransactionDbConnector getTransactionsByPaymentID', () => {
    describe('With successfull request', () => {
        beforeEach(async () => {
            await insertTestPaymentModel();
            const result = await contractDbConnector.createPayment(testInsertPayment);
            testInsertTransaction.paymentID = result.data[0].id;

            for (let i = 0; i < numberOfTransactions; i++) {
                testInsertTransaction.typeID = i % 4 + 1;
                testInsertTransaction.hash = ((Math.random() * max - min ) + min).toString();
                const txResult = await transactionDbConnector.createTransaction(testInsertTransaction);
                testGetTransaction.id = txResult.data[0].id;
            }

        });
        afterEach(async () => {
            await clearTestPaymentModel();
        });
        it('Should retrieve all the transaction details from DB connector', async () => {
            const tempGetTransaction = {...testGetTransaction};

            tempGetTransaction.statusID = null;
            tempGetTransaction.typeID = null;

            const result = await transactionDbConnector.getTransactionsByContractID(tempGetTransaction);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('paymentID').that.is.equal(testInsertTransaction.paymentID);
            result.data[0].should.have.property('timestamp').that.is.equal(testInsertTransaction.timestamp);
            result.data.length.should.be.equal(numberOfTransactions);
        });

        it('Should retrieve the transaction details with specific statusID  from DB connector', async () => {
            await Globals.REFRESH_ENUMS();

            const transactionStatuses = Globals.GET_TRANSACTION_STATUS_ENUM();
            const tempGetTransaction = {...testGetTransaction};

            tempGetTransaction.statusID = 1;
            tempGetTransaction.typeID = null;

            const result = await transactionDbConnector.getTransactionsByContractID(tempGetTransaction);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            let flag = true;
            result.data.filter(tx => {
                if (tx.status !== transactionStatuses[tempGetTransaction.statusID]) {
                    flag = false;
                }
            });

            flag.should.be.equal(true);
        });

        it('Should retrieve the transaction details with specific typeID from DB connector', async () => {
            await Globals.REFRESH_ENUMS();

            const transactionTypes = Globals.GET_TRANSACTION_TYPE_ENUM();
            const tempGetTransaction = {...testGetTransaction};

            tempGetTransaction.statusID = null;
            tempGetTransaction.typeID = 2;

            const result = await transactionDbConnector.getTransactionsByContractID(tempGetTransaction);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            let flag = true;
            result.data.filter(tx => {
                if (tx.type !== transactionTypes[tempGetTransaction.typeID]) {
                    flag = false;
                }
            });

            flag.should.be.equal(true);
        });

        it('Should retrieve the transaction details with specific typeID & statusID from DB connector', async () => {
            await Globals.REFRESH_ENUMS();

            const transactionTypes = Globals.GET_TRANSACTION_TYPE_ENUM();
            const transactionStatuses = Globals.GET_TRANSACTION_STATUS_ENUM();
            const tempGetTransaction = {...testGetTransaction};

            tempGetTransaction.statusID = 1;
            tempGetTransaction.typeID = 3;

            const result = await transactionDbConnector.getTransactionsByContractID(tempGetTransaction);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            let flag = true;
            result.data.filter(tx => {
                if (tx.type !== transactionTypes[tempGetTransaction.typeID] ||
                    tx.status !== transactionStatuses[tempGetTransaction.statusID]) {
                    flag = false;
                }
            });

            flag.should.be.equal(true);
        });
    });

    describe('With unsuccessfull request', () => {
        it('Should raise expection bad id', async () => {
            const tempGetTransaction = {...testGetTransaction};
            tempGetTransaction.id = 'BAD_ID';
            try {
                await transactionDbConnector.getTransactionsByContractID(testGetTransaction);
            } catch (err) {
                err.should.have.property('success').that.is.equal(false);
                err.should.have.property('status').that.is.equal(400);
                err.should.have.property('message').that.is.equal('SQL Query failed. Reason: raise_exception');
                err.should.have.property('error').that.is.an('object');
            }
        });
    });
});