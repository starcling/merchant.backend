import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import { IResponseMessage } from '../../../../../src/utils/web/HTTPResponseHandler';
import { IPaymentModelInsertDetails } from '../../../../../src/core/paymentModel/models';
import { PaymentModelDbConnector } from '../../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { addTestMnemonic, removeTestMnemonic } from '../../../../unit/core/hd-wallet/mnemonicHelper';

chai.use(chaiAsPromised);
const expect = chai.expect;

const server = supertest.agent('localhost:3000/');
const endpoint = 'api/v1/pull-payment-models/';

const paymentModels: any = require('../../../../../resources/e2eTestData.json').paymentModels;
const insertPayment: IPaymentModelInsertDetails = paymentModels['insertPaymentModel'];

let pullPaymentModelID: string;

const clearPayment = async () => {
    await new PaymentModelDbConnector().deletePaymentModel(pullPaymentModelID);
};
process.env.MNEMONICID = 'testmnemonicphrase';

describe('PullPaymentModelController: create', () => {
    afterEach(async () => {
        await clearPayment();
    });
    after(async () => {
        await removeTestMnemonic('testmnemonicphrase');
    });
    describe('successful request', () => {
        beforeEach(async () => {
            await addTestMnemonic('testmnemonicphrase');
        });
        afterEach(async () => {
            await removeTestMnemonic('testmnemonicphrase');
        });
        afterEach(async () => {
            await clearPayment();
        });
        it('should return payment model inserted', (done) => {
            const expectedResponse: IResponseMessage = {
                success: true,
                status: 200,
                message: 'Successful payment model inserted.',
                data: []
            };

            server
                .post(`${endpoint}`)
                .send(insertPayment)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;

                    pullPaymentModelID = body.data.id;
                    expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
                    expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
                    expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
                    expect(body).to.have.property('data').that.has.property('id').that.is.equal(pullPaymentModelID);
                    expect(body).to.have.property('data').that.has.property('title').that.is.equal(insertPayment.title);
                    expect(body).to.have.property('data').that.has.property('description').that.is.equal(insertPayment.description);
                    expect(body).to.have.property('data').that.has.property('amount').that.is.equal('' + insertPayment.amount);
                    expect(body).to.have.property('data').that.has.property('initialPaymentAmount')
                        .that.is.equal('' + insertPayment.initialPaymentAmount);
                    expect(body).to.have.property('data').that.has.property('currency').that.is.equal(insertPayment.currency);
                    expect(body).to.have.property('data').that.has.property('typeID').that.is.equal(insertPayment.typeID);
                    expect(body).to.have.property('data').that.has.property('frequency').that.is.equal(insertPayment.frequency);
                    expect(body).to.have.property('data').that.has.property('networkID').that.is.equal(insertPayment.networkID);
                    done(err);
                });
        });
    });

    describe('unsuccessful request', () => {
        beforeEach(async () => {
            await addTestMnemonic('testmnemonicphrase');
        });
        afterEach(async () => {
            await removeTestMnemonic('testmnemonicphrase');
        });
        it('should return missing data', (done) => {
            const unsuccessfullInsertPayment = {...insertPayment};
            delete unsuccessfullInsertPayment.amount;

            server
                .post(`${endpoint}`)
                .send(unsuccessfullInsertPayment)
                .expect(400)
                .end((err: Error, res: any) => {
                    const body = res.body;

                    expect(body).to.have.property('success').that.is.false;
                    expect(body).to.have.property('status').that.is.equal(400);
                    expect(body).to.have.property('error').to.be.an('array');
                    done(err);
                });
        });

        it('should return invalid data', (done) => {
            const unsuccessfullInsertPayment = {...insertPayment};
            unsuccessfullInsertPayment.frequency = Number('string');

            server
                .post(`${endpoint}`)
                .send(unsuccessfullInsertPayment)
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