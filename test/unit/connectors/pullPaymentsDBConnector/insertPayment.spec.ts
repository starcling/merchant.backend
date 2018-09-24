import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { IPaymentModelInsertDetails } from '../../../../src/core/paymentModel/models';
import { PaymentModelDbConnector } from '../../../../src/connectors/dbConnector/PaymentModelDbConnector';
chai.use(chaiAsPromised);
chai.should();

const contractDbConnector = new PaymentDbConnector();
const paymentDbConnector = new PaymentModelDbConnector();
const dataservice = new DataService();
const payments: any = require('../../../../resources/testData.json').payments;
const paymentModels: any = require('../../../../resources/testData.json').paymentModels;

const testInsertPayment = payments['insertTestPayment'];
const testInsertPaymentModel: IPaymentModelInsertDetails = paymentModels['insertTestPaymentModel'];

const clearTestPaymentModel = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payment_models WHERE id = $1;',
        values: [testInsertPayment.pullPaymentModelID]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A ContractDbController insertContract', () => {
    beforeEach(async () => {
        testInsertPayment.pullPaymentModelID = (await paymentDbConnector.createPaymentModel(testInsertPaymentModel)).data[0].id;
    });

    afterEach(async () => {
        await clearTestPaymentModel();
    });

    describe('With successfull request', () => {
        it('should insert a new payment from dbConnector', async () => {
            const result = await contractDbConnector.createPayment(testInsertPayment);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(201);
            result.should.have.property('message').that.is.equal('SQL Insert Query completed successful.');
            result.should.have.property('data').to.be.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('hdWalletIndex').that.is.equal(testInsertPayment.hdWalletIndex);
            result.data[0].should.have.property('pullPaymentModelID').that.is.equal(testInsertPayment.pullPaymentModelID);
            result.data[0].should.have.property('numberOfPayments').that.is.equal(testInsertPayment.numberOfPayments);
            result.data[0].should.have.property('nextPaymentDate').that.is.equal(testInsertPayment.nextPaymentDate.toString());
            result.data[0].should.have.property('lastPaymentDate').that.is.equal('0');
            result.data[0].should.have.property('startTimestamp').that.is.equal(testInsertPayment.startTimestamp.toString());
            result.data[0].should.have.property('customerAddress').that.is.equal(testInsertPayment.customerAddress);
            result.data[0].should.have.property('pullPaymentAddress').that.is.equal(testInsertPayment.pullPaymentAddress);
            result.data[0].should.have.property('statusID').that.is.equal(1);
            result.data[0].should.have.property('userID').that.is.equal(testInsertPayment.userID);
        });
    });

    describe('With unsuccessfull request', () => {
        it('should return not null violation from dbConnector', async () => {
            const tempInsert = Object.assign({}, testInsertPayment);
            delete tempInsert.pullPaymentModelID;
            try {
                await contractDbConnector.createPayment(tempInsert);
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