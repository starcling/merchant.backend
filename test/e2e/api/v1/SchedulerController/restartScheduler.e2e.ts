const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
import * as supertest from 'supertest';
import { SchedulerConnector } from '../../../../../src/connectors/api/v1/SchedulerConnector';
import { PaymentConnector } from '../../../../../src/connectors/api/v1/PaymentConnector';
import { IPaymentInsertDetails, IPaymentUpdateDetails } from '../../../../../src/core/payment/models';

chai.use(chaiAsPromised);
const expect = chai.expect;

process.env.KEY_DB_HOST = 'localhost';
process.env.KEY_DB_PORT = '3305';
process.env.KEY_DB_USER = 'db_service';
process.env.KEY_DB_PASSWORD = 'db_pass';
process.env.KEY_DB_DATABASE = 'keys';

const payments: any = require('../../../../../resources/e2eTestData.json').payments;
const insertPaymentData: IPaymentInsertDetails = payments['insertPayment'];

const server = supertest.agent('http://localhost:3000/');
const endpoint = 'api/v1/scheduler/restart';
const schedulerConnector = new SchedulerConnector();
const paymentConnector = new PaymentConnector();

let payment;

describe('SchedulerController: restartScheduler', () => {
    describe('with successfull request', () => {

        beforeEach(async () => {
            payment = (await paymentConnector.createPayment(insertPaymentData)).data;
        });

        afterEach(async () => {
            await paymentConnector.deletePayment(payment.id);
        });

        it('should restart the scheduler', (done) => {
            const numberOfPayments = 8;
            const tempPayment: IPaymentUpdateDetails = Object.assign({}, payment);
            tempPayment.startTimestamp = Math.floor(new Date(Date.now() + 1000).getTime() / 1000);
            tempPayment.nextPaymentDate = Math.floor(new Date(Date.now() + 1000).getTime() / 1000);
            tempPayment.numberOfPayments = numberOfPayments;
            tempPayment.frequency = 1;

            paymentConnector.updatePayment(tempPayment);

            server
                .post(`api/v1/test/start-scheduler`)
                .send(tempPayment)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('status').that.is.equal(200);
                    expect(body).to.have.property('message').that.is.equal('Successfuly created scheduler.');
                    expect(body).to.have.property('data').that.is.an('string');
                });

            setTimeout(() => {
                server
                    .post(`api/v1/scheduler/stop`)
                    .send({
                        paymentID: tempPayment.id
                    })
                    .expect(200)
                    .end((err: Error, res: any) => {
                        const body = res.body;
                        expect(body).to.have.property('status').that.is.equal(200);
                        expect(body).to.have.property('message').that.is.equal('Successfully stopped scheduler.');
                        expect(body).to.have.property('data').that.is.an('string');
                    });
            }, (numberOfPayments / 2) * 1000 + 200);

            setTimeout(() => {
                server
                    .post(`${endpoint}`)
                    .send({
                        paymentID: tempPayment.id
                    })
                    .expect(200)
                    .end((err: Error, res: any) => {
                        const body = res.body;
                        expect(body).to.have.property('status').that.is.equal(200);
                        expect(body).to.have.property('message').that.is.equal('Successfully restarted scheduler.');
                        expect(body).to.have.property('data').that.is.an('string');
                    });
            }, (numberOfPayments - 3) * 1000 + 200);


            setTimeout(() => {
                paymentConnector.getPayment(tempPayment.id).then(res => {
                    expect(res.data.numberOfPayments).to.be.equal(0);
                    done();
                });
            }, numberOfPayments * 1000 + 200);

        });
    });

    describe('with unsuccessfull request', () => {

        beforeEach(async () => {
            payment = (await paymentConnector.createPayment(insertPaymentData)).data;
        });

        afterEach(async () => {
            await paymentConnector.deletePayment(payment.id);
        });

        it('should not restart scheduler if wrong ID was provided', (done) => {
            const tempPayment: IPaymentUpdateDetails = Object.assign({}, payment);
            server
                .post(`${endpoint}`)
                .send({
                    paymentID: tempPayment.id + 'BAD_ID'
                })
                .expect(400)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('success').that.is.equal(false);
                    expect(body).to.have.property('status').that.is.equal(400);
                    expect(body).to.have.property('message').that.is.equal('Scheduler with provided ID is either already running or doesn\'t exist.');
                    expect(body).to.have.property('error').that.is.an('object');
                    done();
                });


        });
    });
});