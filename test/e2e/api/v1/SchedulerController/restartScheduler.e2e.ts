const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
import * as supertest from 'supertest';
import { IPaymentInsertDetails } from '../../../../../src/core/payment/models';
import { addTestMnemonic, removeTestMnemonic } from '../../../../unit/core/hd-wallet/mnemonicHelper';
import { IPaymentContractInsert, IPaymentContractUpdate } from '../../../../../src/core/contract/models';
import {
    addTestPayment, removeTestPayment, addTestContract, updateTestContract, retrieveTestContract
} from '../../../../unit/core/payment/paymentHelper';

chai.use(chaiAsPromised);
const expect = chai.expect;

const contracts: any = require('../../../../../resources/e2eTestData.json').contracts;
const payments: any = require('../../../../../resources/e2eTestData.json').payments;

const testInsertContract: IPaymentContractInsert = contracts['insertTestContract'];
const testInsertPayment: IPaymentInsertDetails = payments['insertPayment'];

const server = supertest.agent('http://localhost:3000/');
const endpoint = 'api/v1/scheduler/restart';

process.env.MNEMONIC_ID = 'mnemonic_phrase';

let payment;
let contract;
const frequency = 1;

describe('SchedulerController: restartScheduler', () => {
    describe('with successfull request', () => {
        beforeEach('insert tesrt payment and contract', async () => {
            testInsertPayment.frequency = frequency;
            payment = (await addTestPayment(testInsertPayment)).data;
            testInsertContract.paymentID = payment.id;

            contract = (await addTestContract(testInsertContract)).data[0];
        });

        afterEach(async () => {
            await removeTestPayment(payment.id);
        });

        afterEach(async () => {
            await removeTestMnemonic('mnemonic_phrase');
        });

        it('should restart the scheduler', (done) => {
            const numberOfPayments = 8;
            const tempContract: IPaymentContractUpdate = Object.assign({}, contract);
            tempContract.startTimestamp = Math.floor(new Date(Date.now() + 1000).getTime() / 1000);
            tempContract.nextPaymentDate = Math.floor(new Date(Date.now() + 1000).getTime() / 1000);
            tempContract.numberOfPayments = numberOfPayments;

            updateTestContract(tempContract);

            server
                .post(`api/v1/test/start-scheduler`)
                .send({
                    contractID: tempContract.id
                })
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
                        contractID: tempContract.id
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
                        contractID: tempContract.id
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
                retrieveTestContract(tempContract.id).then(res => {
                    expect(res.data[0].numberOfPayments).to.be.equal(0);
                    done();
                });
            }, numberOfPayments * 1000 + 200);

        });
    });

    describe('with unsuccessfull request', () => {
        beforeEach(async () => {
            await addTestMnemonic('mnemonic_phrase');
        });

        beforeEach('insert tesrt payment and contract', async () => {
            testInsertPayment.frequency = frequency;
            payment = (await addTestPayment(testInsertPayment)).data;
            testInsertContract.paymentID = payment.id;

            contract = (await addTestContract(testInsertContract)).data[0];
        });

        afterEach(async () => {
            await removeTestPayment(payment.id);
        });

        afterEach(async () => {
            await removeTestMnemonic('mnemonic_phrase');
        });

        it('should not restart scheduler if wrong ID was provided', (done) => {
            const id = 'BAD_ID';
            server
                .post(`${endpoint}`)
                .send({
                    contractID: id
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