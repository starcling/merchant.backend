import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import clone from 'clone';
import { IResponseMessage } from '../../../src/utils/web/HTTPResponseHandler';
import { IPaymentUpdateDetails, IPaymentInsertDetails } from '../../../src/core/payment/models';
import { DataService, ISqlQuery } from '../../../src/utils/datasource/DataService';
import { PaymentDbConnector } from '../../../src/connectors/dbConnector/paymentsDBconnector';

chai.use(chaiAsPromised);
const expect = chai.expect;

const server = supertest.agent('localhost:3000/');
const endpoint = 'api/v1/payments/';

const payments: any = require('../../../resources/e2eTestData.json').payments; 
const insertPaymentData: IPaymentInsertDetails = payments['insertPayment'];
const updatePayment: IPaymentUpdateDetails = payments['updatePayment'];

const dataservice = new DataService();
const paymentDbConnector = new PaymentDbConnector();

const insertPayment = async () => {
    const result = await paymentDbConnector.insertPayment(insertPaymentData);
    updatePayment.id = result.data[0].id;
}

const clearPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payments WHERE id = $1;',
        values: [updatePayment.id]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
}

describe('PaymentController: update', () => {
    
    beforeEach(async () => {
        await insertPayment();
    });
    
    afterEach(async () => {
        await clearPayment();
    });

    describe('with successful request', () => {
        it('should return ', (done) => {
            const expectedResponse: IResponseMessage = {
                success: true,
                status: 200,
                message: 'Successful payment update.',
                data: []
            }

            server
                .put(`${endpoint}`)
                .send(updatePayment)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
                    expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
                    expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
                    expect(body).to.have.property('data').that.has.property('id').that.is.equal(updatePayment.id);
                    expect(body).to.have.property('data').that.has.property('title').that.is.equal(updatePayment.title);
                    expect(body).to.have.property('data').that.has.property('description').that.is.equal(updatePayment.description);
                    expect(body).to.have.property('data').that.has.property('status').that.is.equal(updatePayment.status);
                    expect(body).to.have.property('data').that.has.property('customerAddress').that.is.equal(updatePayment.customerAddress);
                    expect(body).to.have.property('data').that.has.property('amount').that.is.equal('' + updatePayment.amount);
                    expect(body).to.have.property('data').that.has.property('currency').that.is.equal(updatePayment.currency);
                    expect(body).to.have.property('data').that.has.property('startTS').that.is.equal('' + updatePayment.startts);
                    expect(body).to.have.property('data').that.has.property('endTS').that.is.equal('' + updatePayment.endts);
                    expect(body).to.have.property('data').that.has.property('type').that.is.equal(updatePayment.type);
                    expect(body).to.have.property('data').that.has.property('frequency').that.is.equal(updatePayment.frequency);
                    expect(body).to.have.property('data').that.has.property('transactionHash').that.is.equal(updatePayment.transactionHash);
                    expect(body).to.have.property('data').that.has.property('debitAccount').that.is.equal(updatePayment.debitAccount);
                    done(err);
                });
        });
    });

    describe('unsuccessfull request with missing data', () => {
        it('should return ', (done) => {
            const unsuccessfullUpdatePayment = clone (updatePayment);
            delete unsuccessfullUpdatePayment.startts;

            server
                .put(`${endpoint}`)
                .send(unsuccessfullUpdatePayment)
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

    describe('unsuccessfull request with invalid data', () => {
        it('should return ', (done) => {
            const unsuccessfullUpdatePayment = clone (updatePayment);
            unsuccessfullUpdatePayment.startts = 'string';

            server
                .put(`${endpoint}`)
                .send(unsuccessfullUpdatePayment)
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