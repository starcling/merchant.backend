import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import { IPaymentModelInsertDetails } from '../../../../../src/core/paymentModel/models';
import { PaymentModelDbConnector } from '../../../../../src/connectors/dbConnector/PaymentModelDbConnector';

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

const server = supertest.agent('http://localhost:3000/');
const endpoint = 'api/v1/pull-payments';

const paymentModelsTestData: any = require('../../../../../resources/testData.json').paymentModels;
const testPaymentModel: IPaymentModelInsertDetails = paymentModelsTestData['insertTestPaymentModel'];
let pullPaymentModelID;

const insertTestPayment = async () => {
    // Need to insert test paymentModel using Merchant SDK
    const result = await new PaymentModelDbConnector().createPaymentModel(testPaymentModel);
    pullPaymentModelID = result.data[0].id;
}

const clearTestPayment = async () => {
    await new PaymentModelDbConnector().deletePaymentModel(pullPaymentModelID);
};

describe('PullPaymentModelController: getAllPaymentsModels', () => {
    describe('with success response', () => {
        beforeEach(async () => {
            await insertTestPayment();
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should return array of payments', (done) => {
            server
                .get(`${endpoint}`)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('success').that.is.equal(true);
                    expect(body).to.have.property('status').that.is.equal(200);
                    expect(body).to.have.property('message').that.is.equal('Successfully retrieved all payments.');
                    expect(body).to.have.property('data').that.is.an('array');
                    done(err);
                });
        });
    });
});