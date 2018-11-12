import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import { IPaymentModelInsertDetails } from '../../../../../src/core/paymentModel/models';
import { PaymentModelDbConnector } from '../../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { PaymentDbConnector } from '../../../../../src/connectors/dbConnector/PaymentDbConnector';
// import { HTTPRequestFactory } from '../../../../../src/utils/web/HTTPRequestFactory';

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
let paymentID: string;

const insertPaymentModel = async () => {
    // paymentModel.merchantID = merchantID;
    paymentModel.merchantID = null;
    const result = await new PaymentModelDbConnector().createPaymentModel(paymentModel);
    pullPaymentModelID = result.data[0].id;
};

const clearPaymentModel = async () => {
    await new PaymentModelDbConnector().deletePaymentModel(pullPaymentModelID);
};

const insertPayment = async () => {
    insertPaymentData.pullPaymentModelID = pullPaymentModelID;
    const result = await new PaymentDbConnector().createPayment(insertPaymentData);
    paymentID = result.data[0].id;
};

const clearPayment = async () => {
    await new PaymentDbConnector().deletePayment(paymentID);
};

describe('PaymentController: getPaymentByID', () => {
    describe('with success response', () => {

        beforeEach('insert test payment model', async () => {
            await insertPaymentModel();
        });

        beforeEach('insert test payment', async () => {
            await insertPayment();
        });

        afterEach('remove test payment model', async () => {
            await clearPaymentModel();
        });

        afterEach('remove test payment model', async () => {
            await clearPayment();
        });

        it('Should return payment object', (done) => {
            server
                .get(`${endpoint}${paymentID}`)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;

                    expect(body).to.have.property('success').that.is.equal(true);
                    expect(body).to.have.property('status').that.is.equal(200);
                    expect(body).to.have.property('message')
                        .that.is.equal(`Successfully retrieved payment with ID: ${paymentID}.`);
                    expect(body).to.have.property('data').that.has.property('id');
                    expect(body).to.have.property('data').that.has.property('title').that.is.equal(paymentModel.title);
                    expect(body).to.have.property('data').that.has.property('description').that.is.equal(paymentModel.description);
                    expect(body).to.have.property('data').that.has.property('merchantID').that.is.equal(process.env.MERCHANT_ID);
                    expect(body).to.have.property('data').that.has.property('trialPeriod').that.is.equal('' + paymentModel.trialPeriod);
                    expect(body).to.have.property('data').that.has.property('currency').that.is.equal(paymentModel.currency);
                    expect(body).to.have.property('data').that.has.property('frequency').that.is.equal(paymentModel.frequency);
                    expect(body).to.have.property('data').that.has.property('numberOfPayments')
                        .that.is.equal(insertPaymentData.numberOfPayments);
                    expect(body).to.have.property('data').that.has.property('customerAddress')
                        .that.is.equal(insertPaymentData.customerAddress);
                    expect(body).to.have.property('data').that.has.property('pullPaymentAddress')
                        .that.is.equal(insertPaymentData.pullPaymentAddress);
                    expect(body).to.have.property('data').that.has.property('userID').that.is.equal(insertPaymentData.userID);
                    expect(body).to.have.property('data').that.has.property('nextPaymentDate');
                    expect(body).to.have.property('data').that.has.property('lastPaymentDate').that.is.equal('0');
                    expect(body).to.have.property('data').that.has.property('startTimestamp')
                        .that.is.equal('' + insertPaymentData.startTimestamp);
                    expect(body).to.have.property('data').that.has.property('merchantAddress');
                    expect(body).to.have.property('data').that.has.property('hdWalletIndex');
                    // expect(body).to.have.property('data').that.has.property('merchantName').that.is.equal(merchantName);
                    done(err);
                });
        }).timeout(25000);
    });

    describe('with error response', () => {
        beforeEach('insert test payment model', async () => {
            await insertPaymentModel();
        });

        beforeEach('insert test payment', async () => {
            await insertPayment();
        });

        afterEach('remove test payment model', async () => {
            await clearPaymentModel();
        });

        afterEach('remove test payment model', async () => {
            await clearPayment();
        });

        it('Should return bad request for paymentID', (done) => {
            const id = 'test_id';
            server
                .get(`${endpoint}${id}`)
                .expect(400)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('success').that.is.equal(false);
                    expect(body).to.have.property('status').that.is.equal(400);
                    expect(body).to.have.property('error').that.is.an('array');
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
                    expect(body).to.have.property('message').that.is.equal('Payment with supplied ID not found.');
                    expect(body).to.have.property('error').that.is.equal(null);
                    done(err);
                });
        });
    });
});