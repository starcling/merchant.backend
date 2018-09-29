import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import { IPaymentModelInsertDetails } from '../../../../../src/core/paymentModel/models';
import { PaymentModelDbConnector } from '../../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import {PaymentDbConnector} from '../../../../../src/connectors/dbConnector/PaymentDbConnector';

process.env.CORE_API_KEY =
    'bbe37b8d231f946ddc080ee304bd069038a8082e9b54e462d4eca7e966c807cf379d6f0722b5665cc6200c3dea20c64f0b7bcdd974cb5c65cefcfdf66926d92a';
process.env.MERCHANT_ID = '6873da04-c31a-11e8-9d71-83d7341786f7';

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

const server = supertest.agent('localhost:3000/');
const endpoint = 'api/v2/pull-payments/';

const paymentModels: any = require('../../../../../resources/e2eTestData.json').paymentModels;
const paymentModel: IPaymentModelInsertDetails = paymentModels['insertPaymentModel'];

const payments: any = require('../../../../../resources/testData.json').payments;
const insertPaymentData = payments['insertTestPayment'];

let pullPaymentModelID: string;

const insertPaymentModel = async () => {
    const result = await new PaymentModelDbConnector().createPaymentModel(paymentModel);
    pullPaymentModelID = result.data[0].id;
};

const clearPaymentModel = async () => {
    await new PaymentModelDbConnector().deletePaymentModel(pullPaymentModelID);
};

const insertPayment = async () => {
    insertPaymentData.pullPaymentModelID = pullPaymentModelID;
    await new PaymentDbConnector().createPayment(insertPaymentData);
};

describe('PaymentController: getAllPayments', () => {
    describe('with success response', () => {
        beforeEach('insert test payment model',async () => {
            await insertPaymentModel();
        });

        beforeEach('insert test payment', async () => {
            await insertPayment();
        });

        afterEach('remove test payment model', async () => {
            await clearPaymentModel();
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