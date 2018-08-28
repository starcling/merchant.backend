import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { ContractDbConnector } from '../../../../src/connectors/dbConnector/ContractDbConnector';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { IPaymentInsertDetails } from '../../../../src/core/payment/models';
import { IPaymentContractInsert } from '../../../../src/core/contract/models';
import { MerchantSDK } from '../../../../src/core/MerchantSDK';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { TransactionDbConnector } from '../../../../src/connectors/dbConnector/TransactionDbConnector';
import { ITransactionInsert } from '../../../../src/core/transaction/models';
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

const getContractsTransactions = async (contractID: string, transactionID: string) => {
    const sqlQuery: ISqlQuery = {
        text: `SELECT * FROM public.tb_contracts_transactions WHERE "contractID" = $1 AND "transactionID" = $2;`,
        values: [
            contractID,
            transactionID
        ]
    };
    return await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A transactionDbController', () => {

    before(() => {
        //TODO: Reflect changes on the SDK and use apropiate function for this
        // MerchantSDK.GET_SDK().build({
        //     createPayment: contractDbConnector.createContract
        // });
    })

    after(() => {
        // MerchantSDK.GET_SDK().disconnectRedis();
    });

    beforeEach(async () => {
        await insertTestPayment();
        const result = await contractDbConnector.createContract(testInsertContract);
        testInsertTransaction.contractID = result.data[0].id;
    });

    afterEach(async () => {
        await clearTestPayment();
    });

    describe('With successfull insert request', () => {
        it('should insert a new contract from dbConnector', async () => {
            const result = await transactionDbConnector.createTransaction(testInsertTransaction);
            
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(201);
            result.should.have.property('message').that.is.equal('SQL Insert Query completed successful.');
            result.should.have.property('data').to.be.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('hash').that.is.equal(testInsertTransaction.hash);
            result.data[0].should.have.property('statusID').that.is.equal(testInsertTransaction.statusID);
            result.data[0].should.have.property('contractID').that.is.equal(testInsertTransaction.contractID);
            result.data[0].should.have.property('timestamp').that.is.equal(testInsertTransaction.timestamp);

            const agregationResult = await getContractsTransactions(testInsertTransaction.contractID, result.data[0].id);
            agregationResult.should.have.property('success').that.is.equal(true);
            agregationResult.should.have.property('status').that.is.equal(200);
            agregationResult.should.have.property('message').that.is.equal('SQL Query completed successful.');
            agregationResult.should.have.property('data').to.be.an('array');
            agregationResult.data[0].should.have.property('id');
            agregationResult.data[0].should.have.property('contractID').that.is.equal(testInsertTransaction.contractID);
            agregationResult.data[0].should.have.property('transactionID').that.is.equal(result.data[0].id);
            
        });

        it('should insert a new contract from SDK', async () => {
            // TODO: Reflect changes on SDK and test it
            // const result = await MerchantSDK.GET_SDK().createPayment(testInsertContract);
            // result.should.have.property('success').that.is.equal(true);
            // result.should.have.property('status').that.is.equal(201);
            // result.should.have.property('message').that.is.equal('SQL Insert Query completed successful.');
            // result.should.have.property('data').to.be.an('array');
        });
    });

    describe('With unsuccessfull insert request', () => {
        it('should return not null violation from dbConnector', async () => {
            // const tempInsert = Object.assign({}, testInsertContract);
            // delete tempInsert.paymentID;
            // try {
            //     await contractDbConnector.createContract(tempInsert);
            // } catch (err) {
            //     err.should.have.property('success').that.is.equal(false);
            //     err.should.have.property('status').that.is.equal(400);
            //     err.should.have.property('message').that.is.equal('SQL Query failed. Reason: not_null_violation');
            //     err.should.have.property('error').that.is.equal('23502');
            // }
        });

        it('should return not null violation from SDK', async () => {
            // const tempInsert = Object.assign({}, testInsertContract);
            // delete tempInsert.paymentID;
            // try {
            //     await MerchantSDK.GET_SDK().createPayment(testInsertContract);
            // } catch (err) {
            //     err.should.have.property('success').that.is.equal(false);
            //     err.should.have.property('status').that.is.equal(400);
            //     err.should.have.property('message').that.is.equal('SQL Query failed. Reason: not_null_violation');
            //     err.should.have.property('error').that.is.equal('23502');
            // }
        });
    });

});