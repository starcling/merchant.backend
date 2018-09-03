import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { IPaymentInsertDetails } from '../../../../src/core/payment/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { MerchantSDK } from '../../../../src/core/MerchantSDK';
import { ContractDbConnector } from '../../../../src/connectors/dbConnector/ContractDbConnector';
import { IPaymentContractInsert } from '../../../../src/core/contract/models';
import { Globals } from '../../../../src/utils/globals';
import { TransactionDbConnector } from '../../../../src/connectors/dbConnector/TransactionDbConnector';
import { ITransactionInsert, ITransactionGet } from '../../../../src/core/transaction/models';

chai.use(chaiAsPromised);
chai.should();

const contractDbConnector = new ContractDbConnector();
const paymentDbConnector = new PaymentDbConnector();
const transactionDbConnector = new TransactionDbConnector();
const dataservice = new DataService();

const transactions: any = require('../../../../resources/testData.json').transactions;
const contracts: any = require('../../../../resources/testData.json').contracts;
const payments: any = require('../../../../resources/testData.json').payments;

const testGetTransaction: ITransactionGet = transactions['insertTestTransaction'];
const testInsertTransaction: ITransactionInsert = transactions['insertTestTransaction'];
const testInsertContract: IPaymentContractInsert = contracts['insertTestContract'];
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

describe('A TransactionDbConnector deleteTransaction', () => {
    describe('With successfull request', () => {
        beforeEach(async () => {
            await insertTestPayment();
            const result = await contractDbConnector.createContract(testInsertContract);
            testInsertTransaction.contractID = result.data[0].id;
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
            const tempGetTransaction = Object.assign({}, testGetTransaction);
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
          const tempGetTransaction = Object.assign({}, testGetTransaction);
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