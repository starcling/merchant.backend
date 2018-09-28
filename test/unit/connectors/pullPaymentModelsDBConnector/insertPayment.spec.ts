import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentModelDbConnector } from '../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { IPaymentModelInsertDetails } from '../../../../src/core/paymentModel/models';

process.env.MERCHANT_ID = '6873da04-c31a-11e8-9d71-83d7341786f7';

chai.use(chaiAsPromised);
chai.should();

const paymentModelDbConnector = new PaymentModelDbConnector();
const dataservice = new DataService();

const paymentModelsTestData: any = require('../../../../resources/testData.json').paymentModels;
const testPaymentModel: IPaymentModelInsertDetails = paymentModelsTestData['insertTestPaymentModel'];

let testID: string;

const clearTestPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payment_models WHERE id = $1;',
        values: [testID]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A PaymentModelDBcontroller insertPayment', () => {

    afterEach(async () => {
        await clearTestPayment();
    });

    describe('With successfull request', () => {
        it('should insert a new paymentModel from dbConnector', async () => {
            const result = await paymentModelDbConnector.createPaymentModel(testPaymentModel);
            testID = result.data[0].id;
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(201);
            result.should.have.property('message').that.is.equal('SQL Insert Query completed successful.');
            result.should.have.property('data').to.be.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('title').that.is.equal(testPaymentModel.title);
            result.data[0].should.have.property('description').that.is.equal(testPaymentModel.description);
            result.data[0].should.have.property('amount').that.is.equal(String(testPaymentModel.amount));
            result.data[0].should.have.property('currency').that.is.equal(testPaymentModel.currency);
            result.data[0].should.have.property('typeID').that.is.equal(testPaymentModel.typeID);
            result.data[0].should.have.property('frequency').that.is.equal(testPaymentModel.frequency);
        });

        it('should insert a new payment with cashOut option from dbConnector', async () => {
            const tempInsert = Object.assign({}, testPaymentModel);

            tempInsert.cashOutFrequency = 5;
            tempInsert.automatedCashOut = true;

            const result = await paymentModelDbConnector.createPaymentModel(tempInsert);
            testID = result.data[0].id;
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(201);
            result.should.have.property('message').that.is.equal('SQL Insert Query completed successful.');
            result.should.have.property('data').to.be.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('title').that.is.equal(tempInsert.title);
            result.data[0].should.have.property('description').that.is.equal(tempInsert.description);
            result.data[0].should.have.property('amount').that.is.equal(String(tempInsert.amount));
            result.data[0].should.have.property('currency').that.is.equal(tempInsert.currency);
            result.data[0].should.have.property('typeID').that.is.equal(tempInsert.typeID);
            result.data[0].should.have.property('frequency').that.is.equal(tempInsert.frequency);
            result.data[0].should.have.property('automatedCashOut').that.is.equal(tempInsert.automatedCashOut);
            result.data[0].should.have.property('cashOutFrequency').that.is.equal(tempInsert.cashOutFrequency);
        });
    });

    describe('With unsuccessfull request', () => {
        it('should return not null violation from dbConnector', async () => {
            const tempInsert = {...testPaymentModel};
            delete tempInsert.amount;
            try {
                await paymentModelDbConnector.createPaymentModel(tempInsert);
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