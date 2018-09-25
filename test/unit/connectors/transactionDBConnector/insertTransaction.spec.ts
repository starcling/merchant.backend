import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { IPaymentModelInsertDetails } from '../../../../src/core/paymentModel/models';
import { IPaymentInsert } from '../../../../src/core/payment/models';
import { PaymentModelDbConnector } from '../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { TransactionDbConnector } from '../../../../src/connectors/dbConnector/TransactionDbConnector';
import { ITransactionInsert} from '../../../../src/core/transaction/models';
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
const testInsertPayment: IPaymentInsert = payments['insertTestPayment'];
const testInsertPaymentModal: IPaymentModelInsertDetails = paymentModels['insertTestPaymentModel'];

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

describe('A TransactionDbController insertTransaction', () => {
    beforeEach(async () => {
        await insertTestPayment();
        const result = await contractDbConnector.createPayment(testInsertPayment);
        testInsertTransaction.paymentID = result.data[0].id;
    });

    afterEach(async () => {
        await clearTestPayment();
    });

    describe('With successfull request', () => {
        it('should insert a new transaction from dbConnector', async () => {
            const result = await transactionDbConnector.createTransaction(testInsertTransaction);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(201);
            result.should.have.property('message').that.is.equal('SQL Insert Query completed successful.');
            result.should.have.property('data').to.be.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('hash').that.is.equal(testInsertTransaction.hash);
            result.data[0].should.have.property('statusID').that.is.equal(testInsertTransaction.statusID);
            result.data[0].should.have.property('paymentID').that.is.equal(testInsertTransaction.paymentID);
            result.data[0].should.have.property('timestamp').that.is.equal(testInsertTransaction.timestamp);
        });
    });

    describe('With unsuccessfull insert request', () => {
        it('should return not null violation from dbConnector', async () => {
            const tempInsertTransaction = {...testInsertTransaction};
            delete tempInsertTransaction.paymentID;
            try {
                await transactionDbConnector.createTransaction(tempInsertTransaction);
            } catch (err) {
                err.should.have.property('success').that.is.equal(false);
                err.should.have.property('status').that.is.equal(400);
                err.should.have.property('message').that.is.equal('SQL Query failed. Reason: not_null_violation');
                err.should.have.property('error').to.be.an('object');
                err.error.should.have.property('code').that.is.equal('23502');
                err.error.should.have.property('where');
            }
        });
    });

});