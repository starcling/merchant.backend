const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
import * as supertest from 'supertest';
import { IPaymentInsertDetails, IPaymentUpdateDetails } from '../../../../../src/core/payment/models';
import { addTestMnemonic, removeTestMnemonic } from '../../../../unit/core/hd-wallet/mnemonicHelper';
import { addTestPayment, removeTestPayment, updateTestPayment, retrieveTestPayment } from '../../../../unit/core/payment/paymentHelper';

chai.use(chaiAsPromised);
const expect = chai.expect;

const payments: any = require('../../../../../resources/e2eTestData.json').payments;
const insertPaymentData: IPaymentInsertDetails = payments['insertPayment'];

const server = supertest.agent('http://localhost:3000/');
const endpoint = 'api/v1/scheduler/restart';

let payment;
process.env.MNEMONIC_ID = 'mnemonic_phrase';

describe('SchedulerController: restartScheduler', () => {
    describe('with successfull request', () => {
        beforeEach(async () => {
            payment = await (await addTestPayment(insertPaymentData)).data;
        });

        afterEach(async () => {
            await removeTestPayment(payment.id);
        });
        
        afterEach(async () => {
            await removeTestMnemonic('mnemonic_phrase');
        });

        it('should restart the scheduler',  (done) => {
            const numberOfPayments = 8;
            const tempPayment: IPaymentUpdateDetails = Object.assign({}, payment);
            tempPayment.startTimestamp = Math.floor(new Date(Date.now() + 1000).getTime() / 1000);
            tempPayment.nextPaymentDate = Math.floor(new Date(Date.now() + 1000).getTime() / 1000);
            tempPayment.numberOfPayments = numberOfPayments;
            tempPayment.frequency = 1;

            updateTestPayment(tempPayment);

            server
                .post(`api/v1/test/start-scheduler`)
                .send(tempPayment)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('status').that.is.equal(200);
                    expect(body).to.have.property('message').that.is.equal('Successfuly created scheduler.');
                    expect(body).to.have.property('data');
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
                        expect(body).to.have.property('data');
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
                        expect(body).to.have.property('data');
                    });
            }, (numberOfPayments - 3) * 1000 + 200);


            setTimeout(() => {
                retrieveTestPayment(tempPayment.id).then(res => {
                    expect(res.data.numberOfPayments).to.be.equal(0);
                    done();
                });
            }, numberOfPayments * 1000 + 200);

        });
    });

    describe('with unsuccessfull request', () => {
        beforeEach(async () => {
            await addTestMnemonic('mnemonic_phrase');
        });

        beforeEach(async () => {
            payment = (await addTestPayment(insertPaymentData)).data;
        });

        afterEach(async () => {
            await removeTestPayment(payment.id);
        });
        
        afterEach(async () => {
            await removeTestMnemonic('mnemonic_phrase');
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