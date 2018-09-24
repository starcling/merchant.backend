const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
import * as supertest from 'supertest';

chai.use(chaiAsPromised);
const expect = chai.expect;

const server = supertest.agent('http://localhost:3000/');
const endpoint = 'api/v1/qr/';

describe('QrController: getQrCode', () => {
    describe('with successfull request', () => {
        it('should return an initialised erc20 object details', (done) => {
            const paymentID = '4b01721f0244e7c5b5f63c20942850e447f5a5ee';

            server
                .get(`${endpoint}${paymentID}`)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(body).to.have.property('success').that.is.equal(true);
                    expect(body).to.have.property('status').that.is.equal(200);
                    expect(body).to.have.property('message').that.is.equal('Successfully retrieved the QR code.');
                    expect(body).to.have.property('data').that.is.an('object');
                    expect(body.data).to.have.property('pullPaymentModelURL').that.is.an('string');
                    expect(body.data).to.have.property('pullPaymentURL').that.is.an('string');
                    expect(body.data).to.have.property('transactionURL').that.is.an('string');
                    done(err);
                });
        });
    });
});