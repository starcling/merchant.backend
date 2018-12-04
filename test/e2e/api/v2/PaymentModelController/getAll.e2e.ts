import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import { IPaymentModelInsertDetails } from '../../../../../src/core/paymentModel/models';
import { PaymentModelDbConnector } from '../../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { Globals } from '../../../../../src/utils/globals';

process.env.CORE_API_KEY =
    'bbe37b8d231f946ddc080ee304bd069038a8082e9b54e462d4eca7e966c807cf379d6f0722b5665cc6200c3dea20c64f0b7bcdd974cb5c65cefcfdf66926d92a';
process.env.MERCHANT_ID = '6873da04-c31a-11e8-9d71-83d7341786f7';

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

const server = supertest.agent('http://localhost:3000/');
const endpoint = 'api/v2/pull-payments';

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
                .set(Globals.GET_MOBILE_AUTH_TOKEN_NAME(), Globals.GET_TEST_FCM_TOKEN())
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