import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import { IResponseMessage } from '../../../../../src/utils/web/HTTPResponseHandler';
import { IPaymentInsertDetails } from '../../../../../src/core/payment/models';
import { PaymentDbConnector } from '../../../../../src/connectors/dbConnector/PaymentDbConnector';
import { addTestMnemonic, removeTestMnemonic } from '../../../../unit/core/hd-wallet/mnemonicHelper';
import { consoleTestResultHandler } from 'tslint/lib/test';
import { Globals } from '../../../../../src/utils/globals';

chai.use(chaiAsPromised);
const expect = chai.expect;

const server = supertest.agent('localhost:3000/');
const endpoint = 'api/v1/payments/';

const payments: any = require('../../../../../resources/e2eTestData.json').payments;
const insertPayment: IPaymentInsertDetails = payments['insertPayment'];

let paymentID: string;

const clearPayment = async () => {
    await new PaymentDbConnector().deletePayment(paymentID);
};
process.env.MNEMONIC_ID='test_mnemonic_phrase'

describe('PaymentController: create', () => {
    afterEach(async () => {
        await clearPayment();
    });
    after(async () => {
        await removeTestMnemonic('test_mnemonic_phrase');
    });
    describe('successful request', () => {
        beforeEach(async () => {
            await addTestMnemonic('test_mnemonic_phrase');
        });
        afterEach(async () => {
            await removeTestMnemonic('test_mnemonic_phrase');
        });
        afterEach(async () => {
            await clearPayment();
        });
        it('should return payment inserted', (done) => {
            const expectedResponse: IResponseMessage = {
                success: true,
                status: 200,
                message: 'Successful payment insert.',
                data: []
            };

            server
                .post(`${endpoint}`)
                .set(Globals.GET_FCM_MOBILE_TOKEN_NAME(), Globals.GET_TEST_FCM_TOKEN())
                .send(insertPayment)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;

                    paymentID = body.data.id;
                    expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
                    expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
                    expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
                    expect(body).to.have.property('data').that.has.property('id').that.is.equal(paymentID);
                    expect(body).to.have.property('data').that.has.property('title').that.is.equal(insertPayment.title);
                    expect(body).to.have.property('data').that.has.property('description').that.is.equal(insertPayment.description);
                    expect(body).to.have.property('data').that.has.property('amount').that.is.equal('' + insertPayment.amount);
                    expect(body).to.have.property('data').that.has.property('initialPaymentAmount').that.is.equal('' + insertPayment.initialPaymentAmount);
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
            await addTestMnemonic('test_mnemonic_phrase');
        });
        afterEach(async () => {
            await removeTestMnemonic('test_mnemonic_phrase');
        });
        it('should return missing data', (done) => {
            const unsuccessfullInsertPayment = Object.assign({}, insertPayment);
            delete unsuccessfullInsertPayment.amount;

            server
                .post(`${endpoint}`)
                .set(Globals.GET_FCM_MOBILE_TOKEN_NAME(), Globals.GET_TEST_FCM_TOKEN())
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
            const unsuccessfullInsertPayment = Object.assign({}, insertPayment);
            unsuccessfullInsertPayment.frequency = Number('string');

            server
                .post(`${endpoint}`)
                .set(Globals.GET_FCM_MOBILE_TOKEN_NAME(), Globals.GET_TEST_FCM_TOKEN())
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