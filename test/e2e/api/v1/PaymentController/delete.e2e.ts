import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import { IResponseMessage } from '../../../../../src/utils/web/HTTPResponseHandler';
import { IPaymentModelInsertDetails } from '../../../../../src/core/paymentModel/models';
import { PaymentModelDbConnector } from '../../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import {PaymentDbConnector} from '../../../../../src/connectors/dbConnector/PaymentDbConnector';

chai.use(chaiAsPromised);
const expect = chai.expect;

const server = supertest.agent('localhost:3000/');
const endpoint = 'api/v1/payments/';

const paymentModels: any = require('../../../../../resources/e2eTestData.json').paymentModels;
const paymentModel: IPaymentModelInsertDetails = paymentModels['insertPaymentModel'];

const payments: any = require('../../../../../resources/testData.json').payments;
const insertPaymentData = payments['insertTestPayment'];

let paymentModelID: string;
let paymentID: string;

const insertPaymentModel = async () => {
    const result = await new PaymentModelDbConnector().createPaymentModel(paymentModel);
    paymentModelID = result.data[0].id;
};

const clearPaymentModel = async () => {
    await new PaymentModelDbConnector().deletePaymentModel(paymentModelID);
};

const insertPayment = async () => {
    insertPaymentData.paymentModelID = paymentModelID;
    const result = await new PaymentDbConnector().createPayment(insertPaymentData);
    paymentID = result.data[0].id;
};

describe('Payment Controller: delete', () => {
    beforeEach('insert test payment model',async () => {
        await insertPaymentModel();
    });

    beforeEach('insert test payment', async () => {
        await insertPayment();
    });

    afterEach('remove test payment model', async () => {
        await clearPaymentModel();
    });

    describe('successful request', () => {
        it('should delete paymentModel', (done) => {
            const expectedResponse: IResponseMessage = {
                success: true,
                status: 200,
                message: 'Successfully deleted payment.',
                data: []
            };

            server
                .delete(`${endpoint}${paymentID}`)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;

                    expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
                    expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
                    done(err);
                });
        });
    });

    describe('No paymentModel in the db', () => {
        it('should return 400', (done) => {
            server
                .delete(`${endpoint}${paymentID}NOT_IN_DB`)
                .expect(400)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('success').that.is.equal(false);
                    expect(body).to.have.property('status').that.is.equal(400);
                    expect(body).to.have.property('error');
                    done(err);
                });
        });
    });
});