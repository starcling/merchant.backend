import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentModelDbConnector } from '../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { IPaymentModelInsertDetails } from '../../../../src/core/paymentModel/models';
chai.use(chaiAsPromised);
chai.should();

const paymentDbConnector = new PaymentModelDbConnector();
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

describe('A PaymentDBcontroller insertPayment', () => {

    afterEach(async () => {
        await clearTestPayment();
    });

    describe('With successfull request', () => {
        it('should insert a new paymentModel from dbConnector', async () => {
            const result = await paymentDbConnector.createPaymentModel(testPaymentModel);
            console.debug(result);
            testID = result.data[0].id;
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(201);
            result.should.have.property('message').that.is.equal('SQL Insert Query completed successful.');
            result.should.have.property('data').to.be.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('title').that.is.equal(testPaymentModel.title);
            result.data[0].should.have.property('description').that.is.equal(testPaymentModel.description);
            result.data[0].should.have.property('promo').that.is.equal(null);
            result.data[0].should.have.property('amount').that.is.equal(testPaymentModel.amount);
            result.data[0].should.have.property('currency').that.is.equal(testPaymentModel.currency);
            result.data[0].should.have.property('typeID').that.is.equal(testPaymentModel.typeID);
            result.data[0].should.have.property('frequency').that.is.equal(testPaymentModel.frequency);
        });
    });

    describe('With unsuccessfull request', () => {
        it('should return not null violation from dbConnector', async () => {
            const tempInsert = {...testPaymentModel};
            delete tempInsert.amount;
            try {
                await paymentDbConnector.createPaymentModel(tempInsert);
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