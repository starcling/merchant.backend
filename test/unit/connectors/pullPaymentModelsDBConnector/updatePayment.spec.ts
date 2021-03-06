import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentModelDbConnector } from '../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { IPaymentModelInsertDetails, IPaymentModelUpdateDetails } from '../../../../src/core/paymentModel/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';

process.env.MERCHANT_ID = '6873da04-c31a-11e8-9d71-83d7341786f7';

chai.use(chaiAsPromised);
chai.should();

const dataservice = new DataService();
const paymentDbConnector = new PaymentModelDbConnector();

const paymentModelsTestData: any = require('../../../../resources/testData.json').paymentModels;
const testPaymentModel: IPaymentModelInsertDetails = paymentModelsTestData['insertTestPaymentModel'];
const updateTestPayment: IPaymentModelUpdateDetails = paymentModelsTestData['updateTestPaymentModel'];

const insertTestPayment = async () => {
    const result = await paymentDbConnector.createPaymentModel(testPaymentModel);
    updateTestPayment.id = result.data[0].id;
};

const clearTestPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payment_models WHERE id = $1;',
        values: [updateTestPayment.id]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A PaymentModelDbConnector updatePaymentModel', () => {
    describe('With successfull request', () => {
        beforeEach(async () => {
            await insertTestPayment();
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should return true if the record is updated', async () => {
            const result = await paymentDbConnector.updatePaymentModel(updateTestPayment);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id').that.is.equal(updateTestPayment.id);
            result.data[0].should.have.property('title').that.is.equal(updateTestPayment.title);
            result.data[0].should.have.property('description').that.is.equal(updateTestPayment.description);
            result.data[0].should.have.property('amount').that.is.equal(String(updateTestPayment.amount));
            result.data[0].should.have.property('currency').that.is.equal(updateTestPayment.currency);
            result.data[0].should.have.property('typeID').that.is.equal(updateTestPayment.typeID);
            result.data[0].should.have.property('frequency').that.is.equal(updateTestPayment.frequency);
        });
    });

    describe('With unsuccessfull request', () => {
        it('Should return false if no record is found in the database', async () => {
            updateTestPayment.id = 'e3006e22-90bb-11e8-9daa-939c9206691a';
            try {
                await paymentDbConnector.updatePaymentModel(updateTestPayment);
            } catch (err) {
                err.should.have.property('success').that.is.equal(false);
                err.should.have.property('status').that.is.equal(400);
                err.should.have.property('message').that.is.equal('SQL Query failed. Reason: raise_exception');
                err.should.have.property('error').that.is.an('object');
            }
        })
    })
});