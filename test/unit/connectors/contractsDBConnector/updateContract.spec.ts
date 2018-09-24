import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { IPaymentInsertDetails } from '../../../../src/core/payment/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { MerchantSDK } from '../../../../src/core/MerchantSDK';
import { ContractDbConnector } from '../../../../src/connectors/dbConnector/ContractDbConnector';
import { IPaymentContractUpdate, IPaymentContractInsert } from '../../../../src/core/contract/models';

chai.use(chaiAsPromised);
chai.should();

const contractDbConnector = new ContractDbConnector();
const paymentDbConnector = new PaymentDbConnector();
const dataservice = new DataService();
const contracts: any = require('../../../../resources/testData.json').contracts;
const payments: any = require('../../../../resources/testData.json').payments;

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

describe('A ContractDbConnector updateContract', () => {
    describe('With successful request', () => {
        before(() => {
            MerchantSDK.GET_SDK().build({
                updatePayment: contractDbConnector.updateContract
            });
        })

        after(() => {
            MerchantSDK.GET_SDK().disconnectRedis();
        });
        beforeEach(async () => {
            await insertTestPayment();
            const result = await contractDbConnector.createContract(testInsertContract);
            testUpdateContract.id = result.data[0].id;
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should return true if the record is updated', async () => {
            const result = await contractDbConnector.updateContract(testUpdateContract);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id').that.is.equal(testUpdateContract.id);
            result.data[0].should.have.property('hdWalletIndex').that.is.equal(testUpdateContract.hdWalletIndex);
            result.data[0].should.have.property('paymentID').that.is.equal(testInsertContract.paymentID);
            result.data[0].should.have.property('numberOfPayments').that.is.equal(testUpdateContract.numberOfPayments);
            result.data[0].should.have.property('nextPaymentDate').that.is.equal(testUpdateContract.nextPaymentDate.toString());
            result.data[0].should.have.property('lastPaymentDate').that.is.equal(testUpdateContract.lastPaymentDate.toString());
            result.data[0].should.have.property('startTimestamp').that.is.equal(testUpdateContract.startTimestamp.toString());
            result.data[0].should.have.property('customerAddress').that.is.equal(testInsertContract.customerAddress);
            result.data[0].should.have.property('pullPaymentAddress').that.is.equal(testInsertContract.pullPaymentAddress);
            result.data[0].should.have.property('statusID').that.is.equal(testUpdateContract.statusID);
            result.data[0].should.have.property('userID').that.is.equal(testUpdateContract.userID);
        });
        it('Should return true if the record is updated', async () => {
            const result = await MerchantSDK.GET_SDK().updatePayment(testUpdateContract);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id').that.is.equal(testUpdateContract.id);
            result.data[0].should.have.property('hdWalletIndex').that.is.equal(testUpdateContract.hdWalletIndex);
            result.data[0].should.have.property('paymentID').that.is.equal(testInsertContract.paymentID);
            result.data[0].should.have.property('numberOfPayments').that.is.equal(testUpdateContract.numberOfPayments);
            result.data[0].should.have.property('nextPaymentDate').that.is.equal(testUpdateContract.nextPaymentDate.toString());
            result.data[0].should.have.property('lastPaymentDate').that.is.equal(testUpdateContract.lastPaymentDate.toString());
            result.data[0].should.have.property('startTimestamp').that.is.equal(testUpdateContract.startTimestamp.toString());
            result.data[0].should.have.property('customerAddress').that.is.equal(testInsertContract.customerAddress);
            result.data[0].should.have.property('pullPaymentAddress').that.is.equal(testInsertContract.pullPaymentAddress);
            result.data[0].should.have.property('statusID').that.is.equal(testUpdateContract.statusID);
            result.data[0].should.have.property('userID').that.is.equal(testUpdateContract.userID);
        });
    });

    describe('With unsuccessfull request', () => {
        it('Should return false if no record is found in the database', async () => {
            testUpdateContract.id = 'e3006e22-90bb-11e8-9daa-939c9206691a';
            try {
                await contractDbConnector.updateContract(testUpdateContract);
            } catch (err) {
                err.should.have.property('success').that.is.equal(false);
                err.should.have.property('status').that.is.equal(400);
                err.should.have.property('message').that.is.equal('SQL Query failed. Reason: raise_exception');
                err.should.have.property('error').that.is.an('object');
            }
        })
    })
});