import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import clone from 'clone';
import { IResponseMessage } from '../../../src/utils/web/HTTPResponseHandler';
import { IPaymentInsertDetails } from '../../../src/core/payment/models';
import { DataService, ISqlQuery } from '../../../src/utils/datasource/DataService';

chai.use(chaiAsPromised);
const expect = chai.expect;

const server = supertest.agent('localhost:3000/');
const endpoint = 'api/v1/payments/';

const payments: any = require('../../../resources/e2eTestData.json').payments; 
const insertPayment: IPaymentInsertDetails = payments['insertPayment'];

const dataservice = new DataService();

var paymentID: string;

const clearPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payments WHERE id = $1;',
        values: [paymentID]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
}

describe('PaymentController: create', () => {
    afterEach(async () => {
        await clearPayment();
    });

    describe('successful request', () => {
        it('should return payment inserted', (done) => {
            const expectedResponse: IResponseMessage = {
                success: true,
                status: 200,
                message: 'Successful payment insert.',
                data: []
            }

            server
                .post(`${endpoint}`)
                .send(insertPayment)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    paymentID = body.data.id;
                    expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
                    expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
                    expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
                    expect(body).to.have.property('data').that.has.property('title').that.is.equal(insertPayment.title);
                    expect(body).to.have.property('data').that.has.property('description').that.is.equal(insertPayment.description);
                    expect(body).to.have.property('data').that.has.property('status').that.is.equal(insertPayment.status);
                    expect(body).to.have.property('data').that.has.property('amount').that.is.equal('' + insertPayment.amount);
                    expect(body).to.have.property('data').that.has.property('currency').that.is.equal(insertPayment.currency);
                    expect(body).to.have.property('data').that.has.property('startTS').that.is.equal('' + insertPayment.startts);
                    expect(body).to.have.property('data').that.has.property('endTS').that.is.equal('' + insertPayment.endts);
                    expect(body).to.have.property('data').that.has.property('type').that.is.equal(insertPayment.type);
                    expect(body).to.have.property('data').that.has.property('frequency').that.is.equal(insertPayment.frequency);
                    done(err);
                });
        });
    });

    describe('unsuccessful request', () => {
        it('should return missing data', (done) => {
            const unsuccessfullInsertPayment = clone (insertPayment);
            delete unsuccessfullInsertPayment.startts;

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

        it('should return invalid data', (done) => {
            const unsuccessfullInsertPayment = clone (insertPayment);
            unsuccessfullInsertPayment.startts = 'string';

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