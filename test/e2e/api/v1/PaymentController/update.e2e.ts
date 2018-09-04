import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import { IResponseMessage } from '../../../../../src/utils/web/HTTPResponseHandler';
import { IPaymentUpdateDetails, IPaymentInsertDetails } from '../../../../../src/core/payment/models';
import { PaymentDbConnector } from '../../../../../src/connectors/dbConnector/PaymentDbConnector';

chai.use(chaiAsPromised);
const expect = chai.expect;

const server = supertest.agent('localhost:3000/');
const endpoint = 'api/v1/payments/';

const payments: any = require('../../../../../resources/e2eTestData.json').payments; 
const insertPaymentData: IPaymentInsertDetails = payments['insertPayment'];
const updatePayment: IPaymentUpdateDetails = payments['updatePayment'];


const insertPayment = async () => {
    const result = await new PaymentDbConnector().createPayment(insertPaymentData);
    updatePayment.id = result.data[0].id;
};

const clearPayment = async () => {
    await new PaymentDbConnector().deletePayment(updatePayment.id);
}

describe('PaymentController: update', () => {
    beforeEach(async () => {
        await insertPayment();
    });
    afterEach(async () => {
        await clearPayment();
    });
    describe('successful request', () => {
        it('should return payment updated', (done) => {
            const expectedResponse: IResponseMessage = {
                success: true,
                status: 200,
                message: 'Successful payment update.',
                data: []
            };

            server
                .put(`${endpoint}${updatePayment.id}`)
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
                    expect(body).to.have.property('data').that.has.property('amount').that.is.equal(updatePayment.amount.toString());
                    expect(body).to.have.property('data').that.has.property('initialPaymentAmount').that.is.equal(updatePayment.initialPaymentAmount.toString());
                    expect(body).to.have.property('data').that.has.property('currency').that.is.equal(updatePayment.currency);
                    expect(body).to.have.property('data').that.has.property('typeID').that.is.equal(updatePayment.typeID);
                    expect(body).to.have.property('data').that.has.property('frequency').that.is.equal(updatePayment.frequency);
                    done(err);
                });
        });
    });

    describe('unsuccessfull request', () => {
        it('should return missing data', (done) => {
            const unsuccessfullUpdatePayment = Object.assign({}, updatePayment);
            delete unsuccessfullUpdatePayment.amount;

            server
                .put(`${endpoint}${updatePayment.id}`)
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

        it('should return invalid data', (done) => {
            const unsuccessfullUpdatePayment = Object.assign({}, updatePayment);
            unsuccessfullUpdatePayment.amount = Number('string');

            server
                .put(`${endpoint}${updatePayment.id}`)
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