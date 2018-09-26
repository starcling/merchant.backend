import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import { IPaymentModelUpdateDetails, IPaymentModelInsertDetails } from '../../../../../src/core/paymentModel/models';
import { PaymentModelDbConnector } from '../../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { Globals } from '../../../../../src/utils/globals';

chai.use(chaiAsPromised);
const expect = chai.expect;

const server = supertest.agent('localhost:3000/');
const endpoint = 'api/v1/pull-payment-models/';

const payments: any = require('../../../../../resources/e2eTestData.json').paymentModels;
const insertPaymentModel: IPaymentModelInsertDetails = payments['insertPaymentModel'];
const updatePaymentModel: IPaymentModelUpdateDetails = payments['updatePaymentModel'];

const insertPayment = async () => {
    const result = await new PaymentModelDbConnector().createPaymentModel(insertPaymentModel);
    updatePaymentModel.id = result.data[0].id;
};

const clearPayment = async () => {
    await new PaymentModelDbConnector().deletePaymentModel(updatePaymentModel.id);
};

describe('PullPaymentModelController: patch', () => {
    beforeEach(async () => {
        await insertPayment();
    });
    afterEach(async () => {
        await clearPayment();
    });

    describe('successful request', () => {
        it('should return paymentModel updated', (done) => {
            const tempPayment = {
                id: updatePaymentModel.id,
                title: '------------------',
                automatedCashOut: false,
                cashOutFrequency: 0
            };

            server
                .patch(`${endpoint}${tempPayment.id}`)
                .set(Globals.GET_FCM_MOBILE_TOKEN_NAME(), Globals.GET_TEST_FCM_TOKEN())
                .send(tempPayment)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('success').that.is.equal(true);
                    expect(body).to.have.property('status').that.is.equal(200);
                    expect(body).to.have.property('message').that.is.equal('Successful payment model updated.');
                    expect(body).to.have.property('data').that.has.property('id').that.is.equal(updatePaymentModel.id);
                    expect(body).to.have.property('data').that.has.property('title').that.is.equal(tempPayment.title);
                    expect(body).to.have.property('data').that.has.property('description').that.is.equal(updatePaymentModel.description);
                    expect(body).to.have.property('data').that.has.property('amount').that.is.equal(updatePaymentModel.amount.toString());
                    expect(body).to.have.property('data').that.has.property('currency').that.is.equal(updatePaymentModel.currency);
                    expect(body).to.have.property('data').that.has.property('typeID').that.is.equal(updatePaymentModel.typeID);
                    expect(body).to.have.property('data').that.has.property('frequency').that.is.equal(updatePaymentModel.frequency);
                    done(err);
                });
        });
    });

    describe('unsuccessfull request', () => {
        it('should return invalid data', (done) => {
            const tempPayment = {
                id: updatePaymentModel.id,
                startTimestamp: '------------------',
                automatedCashOut: false,
                cashOutFrequency: 0
            };

            server
                .patch(`${endpoint}${tempPayment.id}`)
                .set(Globals.GET_FCM_MOBILE_TOKEN_NAME(), Globals.GET_TEST_FCM_TOKEN())
                .send(tempPayment)
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