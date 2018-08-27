import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { ContractDbConnector } from '../../../../src/connectors/dbConnector/ContractDbConnector';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { IPaymentInsertDetails, IPaymentContractInsert } from '../../../../src/core/payment/models';
import { MerchantSDK } from '../../../../src/core/MerchantSDK';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
chai.use(chaiAsPromised);
chai.should();

const contractDbConnector = new ContractDbConnector();
const paymentDbConnector = new PaymentDbConnector();
const dataservice = new DataService();
const contracts: any = require('../../../../resources/testData.json').contracts;
const payments: any = require('../../../../resources/testData.json').payments;

const testInsertContract: IPaymentContractInsert = contracts['insertTestContract'];
const testInsertPayment: IPaymentInsertDetails = payments['insertTestPayment'];

const clearTestPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payments WHERE id = $1;',
        values: [testInsertContract.paymentID]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A contractDbController', () => {

    before(() => {
        MerchantSDK.GET_SDK().build({
            createPayment: contractDbConnector.createContract
        });
    })

    after(() => {
        MerchantSDK.GET_SDK().disconnectRedis();
    });

    beforeEach(async () => {
        testInsertContract.paymentID = (await paymentDbConnector.createPayment(testInsertPayment)).data[0].id;
    });

    afterEach(async () => {
        await clearTestPayment();
    });

    describe('With successfull insert request', () => {
        it('should insert a new contract from dbConnector', async () => {
            const result = await contractDbConnector.createContract(testInsertContract);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(201);
            result.should.have.property('message').that.is.equal('SQL Insert Query completed successful.');
            result.should.have.property('data').to.be.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('hdWalletIndex').that.is.equal(testInsertContract.hdWalletIndex);
            result.data[0].should.have.property('paymentID').that.is.equal(testInsertContract.paymentID);
            result.data[0].should.have.property('numberOfPayments').that.is.equal(testInsertContract.numberOfPayments);
            result.data[0].should.have.property('nextPaymentDate').that.is.equal(testInsertContract.nextPaymentDate.toString());
            result.data[0].should.have.property('lastPaymentDate').that.is.equal(testInsertContract.lastPaymentDate.toString());
            result.data[0].should.have.property('startTimestamp').that.is.equal(testInsertContract.startTimestamp.toString());
            result.data[0].should.have.property('customerAddress').that.is.equal(testInsertContract.customerAddress);
            result.data[0].should.have.property('pullPaymentAddress').that.is.equal(testInsertContract.pullPaymentAddress);
            result.data[0].should.have.property('statusID').that.is.equal(testInsertContract.statusID);
            result.data[0].should.have.property('userID').that.is.equal(testInsertContract.userID);
        });

        it('should insert a new contract from SDK', async () => {
            const result = await MerchantSDK.GET_SDK().createPayment(testInsertContract);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(201);
            result.should.have.property('message').that.is.equal('SQL Insert Query completed successful.');
            result.should.have.property('data').to.be.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('hdWalletIndex').that.is.equal(testInsertContract.hdWalletIndex);
            result.data[0].should.have.property('paymentID').that.is.equal(testInsertContract.paymentID);
            result.data[0].should.have.property('numberOfPayments').that.is.equal(testInsertContract.numberOfPayments);
            result.data[0].should.have.property('nextPaymentDate').that.is.equal(testInsertContract.nextPaymentDate.toString());
            result.data[0].should.have.property('lastPaymentDate').that.is.equal(testInsertContract.lastPaymentDate.toString());
            result.data[0].should.have.property('startTimestamp').that.is.equal(testInsertContract.startTimestamp.toString());
            result.data[0].should.have.property('customerAddress').that.is.equal(testInsertContract.customerAddress);
            result.data[0].should.have.property('pullPaymentAddress').that.is.equal(testInsertContract.pullPaymentAddress);
            result.data[0].should.have.property('statusID').that.is.equal(testInsertContract.statusID);
            result.data[0].should.have.property('userID').that.is.equal(testInsertContract.userID);
        });
    });

    describe('With unsuccessfull insert request', () => {
        it('should return not null violation from dbConnector', async () => {
            const tempInsert = Object.assign({}, testInsertContract);
            delete tempInsert.paymentID;
            try {
                await contractDbConnector.createContract(tempInsert);
            } catch (err) {
                err.should.have.property('success').that.is.equal(false);
                err.should.have.property('status').that.is.equal(400);
                err.should.have.property('message').that.is.equal('SQL Query failed. Reason: not_null_violation');
                err.should.have.property('error').that.is.equal('23502');
            }
        });

        it('should return not null violation from SDK', async () => {
            const tempInsert = Object.assign({}, testInsertContract);
            delete tempInsert.paymentID;
            try {
                await MerchantSDK.GET_SDK().createPayment(testInsertContract);
            } catch (err) {
                err.should.have.property('success').that.is.equal(false);
                err.should.have.property('status').that.is.equal(400);
                err.should.have.property('message').that.is.equal('SQL Query failed. Reason: not_null_violation');
                err.should.have.property('error').that.is.equal('23502');
            }
        });
    });

});