import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import {IResponseMessage} from '../../../../../src/utils/web/HTTPResponseHandler';
import {IPaymentModelInsertDetails} from '../../../../../src/core/paymentModel/models';
import {PaymentModelDbConnector} from '../../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import {addTestMnemonic, removeTestMnemonic} from '../../../../unit/core/hd-wallet/mnemonicHelper';
import {Globals} from '../../../../../src/utils/globals';

chai.use(chaiAsPromised);
const expect = chai.expect;

const server = supertest.agent('localhost:3000/');
const endpoint = 'api/v1/pull-payments/';

const paymentModels: any = require('../../../../../resources/e2eTestData.json').paymentModels;
const paymentModel: IPaymentModelInsertDetails = paymentModels['insertPaymentModel'];

const payments: any = require('../../../../../resources/e2eTestData.json').payments;
const insertPayment = payments['insertTestPayment'];

let pullPaymentModelID: string;
let paymentID: string;

const insertPaymentModel = async () => {
    const result = await new PaymentModelDbConnector().createPaymentModel(paymentModel);
    pullPaymentModelID = result.data[0].id;
};

const clearPaymentModel = async () => {
    await new PaymentModelDbConnector().deletePaymentModel(pullPaymentModelID);
};

process.env.MNEMONIC_ID = 'test_mnemonic_phrase';

describe('PaymentController: create', () => {
    beforeEach('add payment model', async () => {
        await insertPaymentModel();
    });
    afterEach('clear payment mode;l', async () => {
        await clearPaymentModel();
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
        it('should return payment inserted', (done) => {
            const expectedResponse: IResponseMessage = {
                success: true,
                status: 200,
                message: 'Successful payment inserted.',
                data: []
            };
            insertPayment.pullPaymentModelID = pullPaymentModelID;
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
                    expect(body).to.have.property('data').that.has.property('pullPaymentModelID').that.is.equal(pullPaymentModelID);
                    expect(body).to.have.property('data').that.has.property('numberOfPayments')
                        .that.is.equal(paymentModel.numberOfPayments);
                    expect(body).to.have.property('data').that.has.property('customerAddress').that.is.equal(insertPayment.customerAddress);
                    expect(body).to.have.property('data').that.has.property('pullPaymentAddress')
                        .that.is.equal(insertPayment.pullPaymentAddress);
                    expect(body).to.have.property('data').that.has.property('statusID').that.is.equal(1);
                    expect(body).to.have.property('data').that.has.property('userID').that.is.equal(insertPayment.userID);
                    expect(body).to.have.property('data').that.has.property('nextPaymentDate')
                        .that.is.equal('' + (insertPayment.startTimestamp + paymentModel.trialPeriod));
                    expect(body).to.have.property('data').that.has.property('lastPaymentDate').that.is.equal('0');
                    expect(body).to.have.property('data').that.has.property('startTimestamp')
                        .that.is.equal('' + (insertPayment.startTimestamp + paymentModel.trialPeriod));
                    expect(body).to.have.property('data').that.has.property('merchantAddress');
                    expect(body).to.have.property('data').that.has.property('hdWalletIndex');
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
            const unsuccessfullInsertPayment = {...insertPayment};
            delete unsuccessfullInsertPayment.startTimestamp;

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
            const unsuccessfullInsertPayment = {...insertPayment};
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