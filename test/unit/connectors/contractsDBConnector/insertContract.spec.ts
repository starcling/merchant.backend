import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { ContractDbConnector } from '../../../../src/connectors/dbConnector/ContractDbConnector';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { IPaymentInsertDetails } from '../../../../src/core/payment/models';
import { IPaymentContractInsert } from '../../../../src/core/contract/models';
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

describe('A ContractDbController insertContract', () => {
    beforeEach(async () => {
        testInsertContract.paymentID = (await paymentDbConnector.createPayment(testInsertPayment)).data[0].id;
    });

    afterEach(async () => {
        await clearTestPayment();
    });

    describe('With successfull request', () => {
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
            result.data[0].should.have.property('lastPaymentDate').that.is.equal('0');
            result.data[0].should.have.property('startTimestamp').that.is.equal(testInsertContract.startTimestamp.toString());
            result.data[0].should.have.property('customerAddress').that.is.equal(testInsertContract.customerAddress);
            result.data[0].should.have.property('pullPaymentAddress').that.is.equal(testInsertContract.pullPaymentAddress);
            result.data[0].should.have.property('statusID').that.is.equal(1);
            result.data[0].should.have.property('userID').that.is.equal(testInsertContract.userID);
        });
    });

    describe('With unsuccessfull request', () => {
        it('should return not null violation from dbConnector', async () => {
            const tempInsert = Object.assign({}, testInsertContract);
            delete tempInsert.paymentID;
            try {
                await contractDbConnector.createContract(tempInsert);
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