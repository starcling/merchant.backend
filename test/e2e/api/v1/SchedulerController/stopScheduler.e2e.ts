const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
import * as supertest from 'supertest';
import { PaymentConnector } from '../../../../../src/connectors/api/v1/PaymentConnector';
import { IPaymentInsertDetails, IPaymentUpdateDetails } from '../../../../../src/core/payment/models';
import { IPaymentContractInsert, IPaymentContractUpdate } from '../../../../../src/core/contract/models';
import { ContractDbConnector } from '../../../../../src/connectors/dbConnector/ContractDbConnector';

chai.use(chaiAsPromised);
const expect = chai.expect;

const contractDbConnector = new ContractDbConnector();

const contracts: any = require('../../../../../resources/e2eTestData.json').contracts;
const payments: any = require('../../../../../resources/e2eTestData.json').payments;

const testInsertContract: IPaymentContractInsert = contracts['insertTestContract'];
const testInsertPayment: IPaymentInsertDetails = payments['insertPayment'];

const server = supertest.agent('http://localhost:3000/');
const endpoint = 'api/v1/scheduler/stop';
const paymentConnector = new PaymentConnector();

let payment;
let contract;
const frequency = 1;

describe('SchedulerController: stopScheduler', () => {
    describe('with successfull request', () => {

        beforeEach(async () => {
            testInsertPayment.frequency = frequency;
            payment = (await paymentConnector.createPayment(testInsertPayment)).data;
            testInsertContract.paymentID = payment.id;
            contract = (await contractDbConnector.createContract(testInsertContract)).data[0];
        });

        afterEach(async () => {
            await paymentConnector.deletePayment(payment.id);
        });

        it('should stop the scheduler', (done) => {
            const numberOfPayments = 8;
            const tempContract: IPaymentContractUpdate = Object.assign({}, contract);
            tempContract.startTimestamp = Math.floor(new Date(Date.now() + 1000).getTime() / 1000);
            tempContract.nextPaymentDate = Math.floor(new Date(Date.now() + 1000).getTime() / 1000);
            tempContract.numberOfPayments = numberOfPayments;

            contractDbConnector.updateContract(tempContract);

            server
                .post(`api/v1/test/start-scheduler/`)
                .send({
                    paymentID: tempContract.id
                })
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('status').that.is.equal(200);
                    expect(body).to.have.property('message').that.is.equal('Successfuly created scheduler.');
                    expect(body).to.have.property('data').that.is.an('string');
                });

            setTimeout(() => {
                server
                    .post(`${endpoint}`)
                    .send({
                        paymentID: tempContract.id
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
                contractDbConnector.getContract(tempContract.id).then(res => {
                    expect(res.data[0].numberOfPayments).to.be.equal(numberOfPayments / 2);
                    done();
                });
            }, numberOfPayments * 1000 + 200);

        });
    });

    describe('with unsuccessfull request', () => {

        it('should not stop scheduler if wrong ID was provided', (done) => {
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
                    expect(body).to.have.property('message').that.is.equal('No scheduler with provided ID found.');
                    expect(body).to.have.property('error').that.is.an('object');
                    done();
                });

        });
    });
});