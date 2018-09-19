const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
import * as supertest from 'supertest';
import { IPaymentModelInsertDetails } from '../../../../../src/core/paymentModel/models';
import { addTestMnemonic, removeTestMnemonic } from '../../../../unit/core/hd-wallet/mnemonicHelper';
import { IPaymentInsert, IPaymentUpdate } from '../../../../../src/core/payment/models';
import {
    addTestPayment, removeTestPaymentModel, addTestPaymentModel, updateTestPayment, retrieveTestPayment
} from '../../../../unit/core/payment/paymentHelper';

chai.use(chaiAsPromised);
const expect = chai.expect;

const paymentModels: any = require('../../../../../resources/e2eTestData.json').paymentModels;
const testInsertPaymentModel: IPaymentModelInsertDetails = paymentModels['insertPaymentModel'];

const payments: any = require('../../../../../resources/TestData.json').payments;
const testInsertPayment: IPaymentInsert = payments['insertTestPayment'];

const server = supertest.agent('http://localhost:3000/');
const endpoint = 'api/v1/scheduler/restart';

process.env.MNEMONIC_ID = 'test_mnemonic_phrase';

let paymentModel;
let payment;
const frequency = 1;

describe('SchedulerController: restartScheduler', () => {
    after(async () => {
        await removeTestMnemonic('test_mnemonic_phrase');
    });
    describe('with successfull request', () => {
        beforeEach('insert test payment Model and payment', async () => {
            testInsertPaymentModel.frequency = frequency;
            paymentModel = (await addTestPaymentModel(testInsertPaymentModel)).data;
            testInsertPayment.paymentModelID = paymentModel.id;

            payment = (await addTestPayment(testInsertPayment)).data[0];
        });

        beforeEach(async () => {
            await addTestMnemonic('test_mnemonic_phrase');
        });

        afterEach(async () => {
            await removeTestPaymentModel(paymentModel.id);
        });

        afterEach(async () => {
            await removeTestMnemonic('test_mnemonic_phrase');
        });

        it('should restart the scheduler', (done) => {
            const numberOfPayments = 8;
            const tempPayment: IPaymentUpdate = {...payment};
            tempPayment.startTimestamp = Math.floor(new Date(Date.now() + 1000).getTime() / 1000);
            tempPayment.nextPaymentDate = Math.floor(new Date(Date.now() + 1000).getTime() / 1000);
            tempPayment.numberOfPayments = numberOfPayments;

            updateTestPayment(tempPayment);

            server
                .post(`api/v1/test/start-scheduler`)
                .send({
                    paymentID: tempPayment.id
                })
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('status').that.is.equal(200);
                    expect(body).to.have.property('message').that.is.equal('Successfuly created scheduler.');
                    expect(body).to.have.property('success').that.is.equal(true);
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
                    expect(res.data[0].numberOfPayments).to.be.equal(0);
                    done();
                });
            }, numberOfPayments * 1000 + 200);

        });
    });

    describe('with unsuccessfull request', () => {
        beforeEach(async () => {
            await addTestMnemonic('test_mnemonic_phrase');
        });

        beforeEach('insert test paymentModel and payment', async () => {
            testInsertPaymentModel.frequency = frequency;
            paymentModel = (await addTestPaymentModel(testInsertPaymentModel)).data;
            testInsertPayment.paymentModelID = paymentModel.id;

            payment = (await addTestPayment(testInsertPayment)).data[0];
        });

        afterEach(async () => {
            await removeTestPaymentModel(paymentModel.id);
        });

        afterEach(async () => {
            await removeTestMnemonic('test_mnemonic_phrase');
        });

        it('should not restart scheduler if wrong ID was provided', (done) => {
            const id = 'BAD_ID';
            server
                .post(`${endpoint}`)
                .send({
                    paymentID: id
                })
                .expect(400)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('success').that.is.equal(false);
                    expect(body).to.have.property('status').that.is.equal(400);
                    expect(body).to.have.property('message')
                        .that.is.equal('Scheduler with provided ID is either already running or doesn\'t exist.');
                    expect(body).to.have.property('error').that.is.an('object');
                    done();
                });
        });
    });
});