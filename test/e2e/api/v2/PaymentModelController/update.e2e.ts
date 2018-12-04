import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import { IResponseMessage } from '../../../../../src/utils/web/HTTPResponseHandler';
import { IPaymentModelUpdateDetails, IPaymentModelInsertDetails } from '../../../../../src/core/paymentModel/models';
import { PaymentModelDbConnector } from '../../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import {Globals} from '../../../../../src/utils/globals';

process.env.CORE_API_KEY =
    'bbe37b8d231f946ddc080ee304bd069038a8082e9b54e462d4eca7e966c807cf379d6f0722b5665cc6200c3dea20c64f0b7bcdd974cb5c65cefcfdf66926d92a';
process.env.MERCHANT_ID = '6873da04-c31a-11e8-9d71-83d7341786f7';

chai.use(chaiAsPromised);
const expect = chai.expect;

const server = supertest.agent('localhost:3000/');
const endpoint = 'api/v2/pull-payment-models/';

const payments: any = require('../../../../../resources/testData.json').paymentModels;
const insertPaymentModel: IPaymentModelInsertDetails = payments['insertTestPaymentModel'];
const updatePaymentModel: IPaymentModelUpdateDetails = payments['updateTestPaymentModel'];

const insertPayment = async () => {
    const result = await new PaymentModelDbConnector().createPaymentModel(insertPaymentModel);
    updatePaymentModel.id = result.data[0].id;
};

const clearPayment = async () => {
    await new PaymentModelDbConnector().deletePaymentModel(updatePaymentModel.id);
};

describe('PullPaymentModelController: update', () => {
    beforeEach(async () => {
        await insertPayment();
    });
    afterEach(async () => {
        await clearPayment();
    });
    describe('successful request', () => {
        it('should return paymentModel updated', (done) => {
            const expectedResponse: IResponseMessage = {
                success: true,
                status: 200,
                message: 'Successful payment model updated.',
                data: []
            };

            server
                .put(`${endpoint}${updatePaymentModel.id}`)
                .set(Globals.GET_MOBILE_AUTH_TOKEN_NAME(), Globals.GET_TEST_FCM_TOKEN())
                .send(updatePaymentModel)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
                    expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
                    expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
                    expect(body).to.have.property('data').that.has.property('id').that.is.equal(updatePaymentModel.id);
                    expect(body).to.have.property('data').that.has.property('title').that.is.equal(updatePaymentModel.title);
                    expect(body).to.have.property('data').that.has.property('description').that.is.equal(updatePaymentModel.description);
                    expect(body).to.have.property('data').that.has.property('amount').that.is.equal(updatePaymentModel.amount.toString());
                    expect(body).to.have.property('data').that.has.property('initialPaymentAmount')
                        .that.is.equal(updatePaymentModel.initialPaymentAmount.toString());
                    expect(body).to.have.property('data').that.has.property('currency').that.is.equal(updatePaymentModel.currency);
                    expect(body).to.have.property('data').that.has.property('typeID').that.is.equal(updatePaymentModel.typeID);
                    expect(body).to.have.property('data').that.has.property('frequency').that.is.equal(updatePaymentModel.frequency);
                    done(err);
                });
        });
    });

    describe('unsuccessfull request', () => {
        it('should return missing data', (done) => {
            const unsuccessfullUpdatePayment = {...updatePaymentModel};
            delete unsuccessfullUpdatePayment.amount;

            server
                .put(`${endpoint}${updatePaymentModel.id}`)
                .set(Globals.GET_MOBILE_AUTH_TOKEN_NAME(), Globals.GET_TEST_FCM_TOKEN())
                .send(unsuccessfullUpdatePayment)
                .expect(400)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('success').that.is.equal(false);
                    expect(body).to.have.property('status').that.is.equal(400);
                    expect(body).to.have.property('error').to.be.an('array');
                    done(err);
                });
        });

        it('should return invalid data', (done) => {
            const unsuccessfullUpdatePayment = {...updatePaymentModel};
            unsuccessfullUpdatePayment.amount = Number('string');

            server
                .put(`${endpoint}${updatePaymentModel.id}`)
                .set(Globals.GET_MOBILE_AUTH_TOKEN_NAME(), Globals.GET_TEST_FCM_TOKEN())
                .send(unsuccessfullUpdatePayment)
                .expect(400)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('success').that.is.equal(false);
                    expect(body).to.have.property('status').that.is.equal(400);
                    expect(body).to.have.property('error').to.be.an('array');
                    done(err);
                });
        });
    });

});