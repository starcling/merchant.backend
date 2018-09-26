import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import { IPaymentModelInsertDetails } from '../../../../../src/core/paymentModel/models';
import { PaymentModelDbConnector } from '../../../../../src/connectors/dbConnector/PaymentModelDbConnector';

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

const server = supertest.agent('http://localhost:3000/');
const endpoint = 'api/v1/pull-payment-models/';

const paymentModelsTestData: any = require('../../../../../resources/testData.json').paymentModels;
const testPaymentModel: IPaymentModelInsertDetails = paymentModelsTestData['insertTestPaymentModel'];
let pullPaymentModelID;

const insertTestPayment = async () => {
    const result = await new PaymentModelDbConnector().createPaymentModel(testPaymentModel);
    pullPaymentModelID = result.data[0].id;
};

const clearTestPayment = async () => {
    await new PaymentModelDbConnector().deletePaymentModel(pullPaymentModelID);
};

describe('PullPaymentModelController: getPaymentModelByID', () => {
    describe('with success response', () => {
        beforeEach(async () => {
            await insertTestPayment();
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should return paymentModel object', (done) => {
            server
                .get(`${endpoint}${pullPaymentModelID}`)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('success').that.is.equal(true);
                    expect(body).to.have.property('status').that.is.equal(200);
                    expect(body).to.have.property('message')
                        .that.is.equal(`Successfully retrieved payment model with ID: ${pullPaymentModelID}`);
                    expect(body).to.have.property('data').that.is.an('object');
                    expect(body.data).to.have.property('title').that.is.equal(testPaymentModel.title);
                    expect(body.data).to.have.property('description').that.is.equal(testPaymentModel.description);
                    expect(body.data).to.have.property('amount').that.is.equal(testPaymentModel.amount.toString());
                    expect(body.data).to.have.property('currency').that.is.equal(testPaymentModel.currency);
                    expect(body.data).to.have.property('typeID').that.is.equal(testPaymentModel.typeID);
                    expect(body.data).to.have.property('frequency').that.is.equal(testPaymentModel.frequency);
                    done(err);
                });
        });
    });

    describe('with error response', () => {
        beforeEach(async () => {
            await insertTestPayment();
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should return query failed', (done) => {
            const id = 'test_id';
            server
                .get(`${endpoint}${id}`)
                .expect(400)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('success').that.is.equal(false);
                    expect(body).to.have.property('status').that.is.equal(400);
                    expect(body).to.have.property('message').that.is.equal('SQL Query failed. Reason: invalid_text_representation');
                    expect(body).to.have.property('error').that.is.an('object');
                    done(err);
                });
        });

        it('Should return not found', (done) => {
            const id = 'eb947468-8a8d-11e8-b552-8f90e6b18af3';
            server
                .get(`${endpoint}${id}`)
                .expect(400)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('success').that.is.equal(false);
                    expect(body).to.have.property('status').that.is.equal(400);
                    expect(body).to.have.property('message').that.is.equal('Payment Model with supplied ID not found.');
                    expect(body).to.have.property('error').that.is.equal(null);
                    done(err);
                });
        });
    });
});