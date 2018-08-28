import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { IPaymentInsertDetails } from '../../../../src/core/payment/models';
import { MerchantSDK } from '../../../../src/core/MerchantSDK';
chai.use(chaiAsPromised);
chai.should();

let paymentDbConnector = new PaymentDbConnector();
const dataservice = new DataService();
const payments: any = require('../../../../resources/testData.json').payments;

const testInsertPayment: IPaymentInsertDetails = payments['insertTestPayment'];
var testID: string;

const clearTestPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payments WHERE id = $1;',
        values: [testID]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A PaymentDBcontroller insertPayment', () => {

    before(() => {
        MerchantSDK.GET_SDK().build({
            createPayment: paymentDbConnector.createPayment
        });
    })

    after(() => {
        MerchantSDK.GET_SDK().disconnectRedis();
    });

    afterEach(async () => {
        await clearTestPayment();
    });

    describe('With successfull request', () => {
        it('should insert a new payment from dbConnector', async () => {
            const result = await paymentDbConnector.createPayment(testInsertPayment);
            testID = result.data[0].id;
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(201);
            result.should.have.property('message').that.is.equal('SQL Insert Query completed successful.');
            result.should.have.property('data').to.be.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('title').that.is.equal(testInsertPayment.title);
            result.data[0].should.have.property('description').that.is.equal(testInsertPayment.description);
            result.data[0].should.have.property('promo').that.is.equal(null);
            result.data[0].should.have.property('amount').that.is.equal(testInsertPayment.amount);
            result.data[0].should.have.property('currency').that.is.equal(testInsertPayment.currency);
            result.data[0].should.have.property('typeID').that.is.equal(testInsertPayment.typeID);
            result.data[0].should.have.property('frequency').that.is.equal(testInsertPayment.frequency);
        });

        it('should insert a new payment from SDK', async () => {
            const result = await MerchantSDK.GET_SDK().createPayment(testInsertPayment);
            testID = result.data[0].id;
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(201);
            result.should.have.property('message').that.is.equal('SQL Insert Query completed successful.');
            result.should.have.property('data').to.be.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('title').that.is.equal(testInsertPayment.title);
            result.data[0].should.have.property('description').that.is.equal(testInsertPayment.description);
            result.data[0].should.have.property('promo').that.is.equal(null);
            result.data[0].should.have.property('amount').that.is.equal(testInsertPayment.amount);
            result.data[0].should.have.property('currency').that.is.equal(testInsertPayment.currency);
            result.data[0].should.have.property('typeID').that.is.equal(testInsertPayment.typeID);
            result.data[0].should.have.property('frequency').that.is.equal(testInsertPayment.frequency);
        });
    });

    describe('With unsuccessfull request', () => {
        it('should return not null violation from dbConnector', async () => {
            const tempInsert = Object.assign({}, testInsertPayment);
            delete tempInsert.amount;
            try {
                await paymentDbConnector.createPayment(tempInsert);
            } catch (err) {
                err.should.have.property('success').that.is.equal(false);
                err.should.have.property('status').that.is.equal(400);
                err.should.have.property('message').that.is.equal('SQL Query failed. Reason: not_null_violation');
                err.should.have.property('error').to.be.an('object');
                err.error.should.have.property('code').that.is.equal('23502');
                err.error.should.have.property('where');
            }
        });

        it('should return not null violation from SDK', async () => {
            const tempInsert = Object.assign({}, testInsertPayment);
            delete tempInsert.amount;
            try {
                await MerchantSDK.GET_SDK().createPayment(testInsertPayment);
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