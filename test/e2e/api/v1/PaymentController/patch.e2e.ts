import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import { IPaymentUpdateDetails, IPaymentInsertDetails } from '../../../../../src/core/payment/models';
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
const updatePayment: IPaymentUpdateDetails = payments['updatePayment'];

const insertPayment = async () => {
    const result = await MerchantSDK.GET_SDK().createPayment(insertPaymentData);
    updatePayment.id = result.data[0].id;
};

const clearPayment = async () => {
    await MerchantSDK.GET_SDK().deletePayment(updatePayment.id);
};

describe('PaymentController: patch', () => {
    beforeEach(async () => {
        await insertPayment();
    });
    afterEach(async () => {
        await clearPayment();
    });

    describe('successful request', () => {
        it('should return payment updated', (done) => {
            const tempPayment = {
                id: updatePayment.id,
                title: '------------------'
            };

            server
                .patch(`${endpoint}${tempPayment.id}`)
                .send(tempPayment)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;

                    expect(body).to.have.property('success').that.is.equal(true);
                    expect(body).to.have.property('status').that.is.equal(200);
                    expect(body).to.have.property('message').that.is.equal('Successful payment update.');
                    expect(body).to.have.property('data').that.has.property('id').that.is.equal(updatePayment.id);
                    expect(body).to.have.property('data').that.has.property('title').that.is.equal(tempPayment.title);
                    expect(body).to.have.property('data').that.has.property('description').that.is.equal(updatePayment.description);
                    expect(body).to.have.property('data').that.has.property('status').that.is.equal(1);
                    expect(body).to.have.property('data').that.has.property('customerAddress').that.is.equal(null);
                    expect(body).to.have.property('data').that.has.property('amount').that.is.equal(updatePayment.amount.toString());
                    expect(body).to.have.property('data').that.has.property('currency').that.is.equal(updatePayment.currency);
                    expect(body).to.have.property('data').that.has.property('startTimestamp').that.is.equal(updatePayment.startTimestamp.toString());
                    expect(body).to.have.property('data').that.has.property('endTimestamp').that.is.equal(updatePayment.endTimestamp.toString());
                    expect(body).to.have.property('data').that.has.property('type').that.is.equal(updatePayment.type);
                    expect(body).to.have.property('data').that.has.property('frequency').that.is.equal(updatePayment.frequency);
                    expect(body).to.have.property('data').that.has.property('registerTxHash').that.is.equal(null);
                    expect(body).to.have.property('data').that.has.property('executeTxHash').that.is.equal(null);
                    expect(body).to.have.property('data').that.has.property('executeTxStatus').that.is.equal(1);
                    expect(body).to.have.property('data').that.has.property('userId').that.is.equal(null);
                    done(err);
                });
        });
    });

    describe('unsuccessfull request', () => {
        it('should return invalid data', (done) => {
            const tempPayment = {
                id: updatePayment.id,
                startTimestamp: '------------------'
            };

            server
                .patch(`${endpoint}${tempPayment.id}`)
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