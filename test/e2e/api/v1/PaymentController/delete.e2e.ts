import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import { IResponseMessage } from '../../../../../src/utils/web/HTTPResponseHandler';
import { IPaymentInsertDetails } from '../../../../../src/core/payment/models';
import { MerchantSDK } from '../../../../../src/core/MerchantSDK';

MerchantSDK.GET_SDK().build({
    merchantApiUrl: 'http://merchant_server:3000/api/v1',
});

chai.use(chaiAsPromised);
const expect = chai.expect;

const server = supertest.agent('localhost:3000/');
const endpoint = 'api/v1/payments/';

const payments: any = require('../../../../../resources/e2eTestData.json').payments; 
const insertPaymentData: IPaymentInsertDetails = payments['insertPayment'];
var paymentID: string;

const insertPayment = async () => {
    const result = await MerchantSDK.GET_SDK().createPayment(insertPaymentData);
    paymentID = result.data[0].id;
};

const clearPayment = async () => {
    await MerchantSDK.GET_SDK().deletePayment(paymentID);
};

describe('PaymentController: delete', () => {
    beforeEach(async () => {
        await insertPayment();
    });

    afterEach(async () => {
        await clearPayment();
    });

    describe('successful request', () => {
        it('should delete payment', (done) => {
            const expectedResponse: IResponseMessage = {
                success: true,
                status: 200,
                message: 'Successfully deleted single payment.',
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

    describe('No payment in the db', () => {
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