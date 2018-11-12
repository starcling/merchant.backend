const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
import { Globals } from '../../../../../src/utils/globals';

import * as supertest from 'supertest';

process.env.CORE_API_KEY =
    'bbe37b8d231f946ddc080ee304bd069038a8082e9b54e462d4eca7e966c807cf379d6f0722b5665cc6200c3dea20c64f0b7bcdd974cb5c65cefcfdf66926d92a';
process.env.MERCHANT_ID = '6873da04-c31a-11e8-9d71-83d7341786f7';

chai.use(chaiAsPromised);
const expect = chai.expect;

const server = supertest.agent('http://localhost:3000/');
const endpoint = 'api/v2/qr/';

describe('QrController: getQrCode', () => {
    describe('with successfull request', () => {
        it('should return an initialised erc20 object details', (done) => {
            const paymentID = '6cae1452-c1c8-11e8-a355-529269fb1459';
            server
                .get(`${endpoint}${paymentID}`)
                .set(Globals.GET_MOBILE_AUTH_TOKEN_NAME(), Globals.GET_TEST_FCM_TOKEN())
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