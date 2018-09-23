import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import { IResponseMessage } from '../../../../../src/utils/web/HTTPResponseHandler';
import { IPaymentModelInsertDetails } from '../../../../../src/core/paymentModel/models';
import { PaymentModelDbConnector } from '../../../../../src/connectors/dbConnector/PaymentModelDbConnector';

chai.use(chaiAsPromised);
const expect = chai.expect;

const server = supertest.agent('localhost:3000/');
const endpoint = 'api/v1/pull-payment-models/';

const paymentModels: any = require('../../../../../resources/e2eTestData.json').paymentModels;
const insertPaymentData: IPaymentModelInsertDetails = paymentModels['insertPaymentModel'];

let pullPaymentModelID: string;

const insertPayment = async () => {
    const result = await new PaymentModelDbConnector().createPaymentModel(insertPaymentData);
    pullPaymentModelID = result.data[0].id;
};

const clearPayment = async () => {
    await new PaymentModelDbConnector().deletePaymentModel(pullPaymentModelID);
};

describe('PullPaymentModelController: delete', () => {
    beforeEach(async () => {
        await insertPayment();
    });

    afterEach(async () => {
        await clearPayment();
    });

    describe('successful request', () => {
        it('should delete paymentModel', (done) => {
            const expectedResponse: IResponseMessage = {
                success: true,
                status: 200,
                message: 'Successfully deleted single paymentModel.',
                data: []
            };

            server
                .delete(`${endpoint}${pullPaymentModelID}`)
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
                .delete(`${endpoint}${pullPaymentModelID}NOTINDB`)
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