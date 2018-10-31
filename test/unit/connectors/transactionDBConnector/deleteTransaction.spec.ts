import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentModelDbConnector } from '../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { IPaymentModelInsertDetails } from '../../../../src/core/paymentModel/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { IPaymentInsert } from '../../../../src/core/payment/models';
import { TransactionDbConnector } from '../../../../src/connectors/dbConnector/TransactionDbConnector';
import { ITransactionInsert, ITransactionGet } from '../../../../src/core/transaction/models';

chai.use(chaiAsPromised);
chai.should();

const paymentDbConnector = new PaymentDbConnector();
const paymentModelDbConnector = new PaymentModelDbConnector();
const transactionDbConnector = new TransactionDbConnector();
const dataservice = new DataService();

const transactions: any = require('../../../../resources/testData.json').transactions;
const payments: any = require('../../../../resources/testData.json').payments;
const paymentModels: any = require('../../../../resources/testData.json').paymentModels;

const testGetTransaction: ITransactionGet = transactions['insertTestTransaction'];
const testInsertTransaction: ITransactionInsert = transactions['insertTestTransaction'];
const testInsertPayment: IPaymentInsert = payments['insertTestPayment'];
const testInsertPaymentModal: IPaymentModelInsertDetails = paymentModels['insertTestPaymentModel'];

const insertTestPayment = async () => {
    const result = await paymentModelDbConnector.createPaymentModel(testInsertPaymentModal);
    testInsertPayment.pullPaymentModelID = result.data[0].id;
};

const clearTestPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payment_models WHERE id = $1;',
        values: [testInsertPayment.pullPaymentModelID]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A TransactionDbConnector deleteTransaction', () => {
    describe('With successfull request', () => {
        beforeEach(async () => {
            await insertTestPayment();
            const result = await paymentDbConnector.createPayment(testInsertPayment);
            testInsertTransaction.paymentID = result.data[0].id;
            const txResult = await transactionDbConnector.createTransaction(testInsertTransaction);
            testGetTransaction.id = txResult.data[0].id;
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should delete transaction', async () => {
            const result = await transactionDbConnector.deleteTransaction(testGetTransaction);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('fc_delete_transaction').that.is.equal(true);
        });
    });

    describe('With unsuccessfull request', () => {
        it('Should raise not bad id exception', async () => {
            const tempGetTransaction = {...testGetTransaction};
            tempGetTransaction.id = 'BAD_ID'
            try {
                await transactionDbConnector.deleteTransaction(testGetTransaction);
            } catch (err) {
                err.should.have.property('success').that.is.equal(false);
                err.should.have.property('status').that.is.equal(400);
                err.should.have.property('message').that.is.equal('SQL Query failed. Reason: raise_exception');
                err.should.have.property('error').that.is.an('object');
            }
        });

        it('Should raise not found error', async () => {
          const tempGetTransaction = {...testGetTransaction};
          tempGetTransaction.id = '63c684fe-8a97-11e8-b99f-9f38301a1e03'
          try {
              await transactionDbConnector.deleteTransaction(testGetTransaction);
          } catch (err) {
              err.should.have.property('success').that.is.equal(false);
              err.should.have.property('status').that.is.equal(400);
              err.should.have.property('message').that.is.equal('SQL Query failed. Reason: raise_exception');
              err.should.have.property('error').that.is.an('object');
          }
      });
    });
});