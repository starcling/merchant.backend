import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import { IPaymentInsertDetails, IPaymentUpdateDetails} from '../../../../../src/core/payment/models';


chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

const server = supertest.agent('http://localhost:3000/');
const endpoint = 'api/v1/payments/';

import { MerchantSDK } from '../../../../../src/core/MerchantSDK';

MerchantSDK.GET_SDK().build({
    merchantApiUrl: 'http://merchant_server:3000/api/v1',
});

const paymentsTestData: any = require('../../../../../resources/testData.json').payments;
const testPayment: IPaymentInsertDetails = paymentsTestData['insertTestPayment'];
let paymentID;

const insertTestPayment = async () => {
    const result = await MerchantSDK.GET_SDK().createPayment(testPayment);
    paymentID = result.data[0].id;
}

const clearTestPayment = async () => {
    await MerchantSDK.GET_SDK().deletePayment(paymentID);
}

describe('PaymentController: getPayment', () => {
    describe('with success response', () => {
        beforeEach(async () => {
            await insertTestPayment();
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should return payment object', (done) => {
            server
                .get(`${endpoint}${paymentID}`)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('success').that.is.equal(true);
                    expect(body).to.have.property('status').that.is.equal(200);
                    expect(body).to.have.property('message').that.is.equal('Successfully retrieved single payment.');
                    expect(body).to.have.property('data').that.is.an('object');
                    expect(body.data).to.have.property('title').that.is.equal(testPayment.title);
                    expect(body.data).to.have.property('description').that.is.equal(testPayment.description);
                    expect(body.data).to.have.property('status').that.is.equal(testPayment.status);
                    expect(body.data).to.have.property('amount').that.is.equal(testPayment.amount);
                    expect(body.data).to.have.property('currency').that.is.equal(testPayment.currency);
                    expect(body.data).to.have.property('startTimestamp').that.is.equal(testPayment.startTimestamp);
                    expect(body.data).to.have.property('endTimestamp').that.is.equal(testPayment.endTimestamp);
                    expect(body.data).to.have.property('type').that.is.equal(testPayment.type);
                    expect(body.data).to.have.property('frequency').that.is.equal(testPayment.frequency);
                    done(err);
                });  
        });
    });
    
    describe('with error response', () => {
        beforeEach(async () => {
            await insertTestPayment();
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should return query failed', (done) => {
            const id = 'test_id';
            server
                .get(`${endpoint}${id}`)
                .expect(400)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('success').that.is.equal(false);
                    expect(body).to.have.property('status').that.is.equal(400);
                    expect(body).to.have.property('message').that.is.equal('SQL Query failed. Reason: invalid_text_representation');
                    expect(body).to.have.property('error').that.is.equal('22P02');
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