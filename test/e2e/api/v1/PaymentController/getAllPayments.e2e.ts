import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import { IPaymentInsertDetails, IPaymentUpdateDetails} from '../../../../../src/core/payment/models';

import { MerchantSDK } from '../../../../../src/core/MerchantSDK';

MerchantSDK.GET_SDK().build({
    merchantApiUrl: 'http://merchant_server:3000/api/v1',
});

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

const server = supertest.agent('http://localhost:3000/');
const endpoint = 'api/v1/payments/';

//const dataservice = new DataService();
//const paymentDbConnector = new PaymentDbConnector();

const paymentsTestData: any = require('../../../../../resources/testData.json').payments;
const testPayment: IPaymentInsertDetails = paymentsTestData['insertTestPayment'];
let paymentID;

const insertTestPayment = async () => {
    // Need to insert test payment using Merchant SDK
    //const result = await paymentDbConnector.insertPayment(testPayment);
    const result = await MerchantSDK.GET_SDK().createPayment(testPayment);
    paymentID = result.data[0].id;
}

const clearTestPayment = async () => {
    /* const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payments WHERE id = $1;',
        values: [paymentID]
    }; */

    await MerchantSDK.GET_SDK().deletePayment(paymentID);
    // Need to delete payment using Merchant SDK
    //await dataservice.executeQueryAsPromise(sqlQuery);
}

describe('PaymentController: getAllPayments', () => {
    describe('with success response', () => {
        beforeEach(async () => {
            await insertTestPayment();
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should return array of payments', (done) => {
            server
                .get(`${endpoint}`)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('success').that.is.equal(true);
                    expect(body).to.have.property('status').that.is.equal(200);
                    expect(body).to.have.property('message').that.is.equal('Successfully retrieved payments.');
                    expect(body).to.have.property('data').that.is.an('array');
                    expect(body.data[0]).to.have.property('title').that.is.equal(testPayment.title);
                    expect(body.data[0]).to.have.property('description').that.is.equal(testPayment.description);
                    expect(body.data[0]).to.have.property('status').that.is.equal(testPayment.status);
                    expect(body.data[0]).to.have.property('amount').that.is.equal(testPayment.amount);
                    expect(body.data[0]).to.have.property('currency').that.is.equal(testPayment.currency);
                    expect(body.data[0]).to.have.property('startTimestamp').that.is.equal(testPayment.startTimestamp);
                    expect(body.data[0]).to.have.property('endTimestamp').that.is.equal(testPayment.endTimestamp);
                    expect(body.data[0]).to.have.property('type').that.is.equal(testPayment.type);
                    expect(body.data[0]).to.have.property('frequency').that.is.equal(testPayment.frequency);
                    done(err);
                });  
        });
    });
});