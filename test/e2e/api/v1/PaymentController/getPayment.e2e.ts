import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import { PaymentDbConnector } from '../../../../../src/connectors/dbConnector/paymentsDBconnector';
import { IPaymentInsertDetails, IPaymentUpdateDetails} from '../../../../../src/core/payment/models';
import { DataService, ISqlQuery } from '../../../../../src/utils/datasource/DataService';


chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

const server = supertest.agent('http://localhost:3000/');
const endpoint = 'api/v1/payments/';

const dataservice = new DataService();
const paymentDbConnector = new PaymentDbConnector();

const paymentsTestData: any = require('../../../../../resources/testData.json').payments;
const testPayment: IPaymentInsertDetails = paymentsTestData['insertTestPayment'];
let paymentID;

const insertTestPayment = async () => {
    const result = await paymentDbConnector.insertPayment(testPayment);
    paymentID = result.data[0].id;
}

const clearTestPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payments WHERE id = $1;',
        values: [paymentID]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
}

describe('PaymentController: getPayment', () => {
    describe('with success responce', () => {
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
                    expect(body.data).to.have.property('startTS').that.is.equal(testPayment.startts);
                    expect(body.data).to.have.property('endTS').that.is.equal(testPayment.endts);
                    expect(body.data).to.have.property('type').that.is.equal(testPayment.type);
                    expect(body.data).to.have.property('frequency').that.is.equal(testPayment.frequency);
                    done(err);
                });  
        });
    });
    
    describe('with error responce', () => {
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