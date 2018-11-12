import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import {IResponseMessage} from '../../../../../src/utils/web/HTTPResponseHandler';
import {Globals} from '../../../../../src/utils/globals';

const tempQrValidator: any = require('../../../../../resources/e2eTestData.json').qrValidator;
const validator = tempQrValidator['qrValidatorForErc20'];

chai.use(chaiAsPromised);
const expect = chai.expect;
const should = chai.should();

const server = supertest.agent('localhost:3000/');
const endpoint = 'api/v2/qr/';

describe('A Get QR For ERC20 E2E Test', () => {
    it('successful', (done) => {
        const tempValidator = {...validator};

        const expectedResponse: IResponseMessage = {
            success: true,
            status: 200,
            message: 'Successful payment inserted.',
            data: []
        };

        const tokenAddress = tempValidator.tokenAddress;
        const address = tempValidator.address;
        const value = tempValidator.value;
        const gas = tempValidator.gas;

        server
            .get(`${endpoint}${tokenAddress}/${address}/${value}/${gas}`)
            .set(Globals.GET_MOBILE_AUTH_TOKEN_NAME(), Globals.GET_TEST_FCM_TOKEN())
            .expect(200)
            .end((err: Error, res: any) => {
                const body = res.body;
                expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
                expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
                expect(body).to.have.property('message').that.is.equal('Successfully retrieved the QR code.');
                expect(body.data).to.have.property('data').that.is.equal('0xa9059cbb000000000000000000000000a9acc3a896548b6afb4e94c073' +
                    '1b04a2982f3c9c0000000000000000000000000000000000000000000000000073510976b4fc23');
                expect(body.data).to.have.property('gas').that.is.equal(gas);
                expect(body.data).to.have.property('value').that.is.equal('0x00');
                expect(body.data).to.have.property('to').that.is.equal(tokenAddress);
                done(err);
            });
    });
    it('unsuccesfull with invalid endpoint values', (done) => {
        const expectedResponse: IResponseMessage = {
            success: false,
            status: 400,
            message: '',
            data: []
        };

        const tokenAddress = 'false_token_address';
        const address = 'false_address';
        const value = 'false_value';
        const gas = 'false_gas';

        server
            .get(`${endpoint}${tokenAddress}/${address}/${value}/${gas}`)
            .set(Globals.GET_MOBILE_AUTH_TOKEN_NAME(), Globals.GET_TEST_FCM_TOKEN())
            .expect(400)
            .end((err: Error, res: any) => {
                const body = res.body;
                expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
                expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
                should.equal(body.error.length, 6);
                expect(body.error[0]).to.have.property('message').that.is.equal('"tokenAddress" with value "false_token_address" fails ' +
                    'to match the required pattern: /^[a-z0-9]+$/');
                expect(body.error[1]).to.have.property('message').that.is.equal('"tokenAddress" length must be at least 42 characters long');
                expect(body.error[2]).to.have.property('message').that.is.equal('"address" with value "false_address" fails to match ' +
                    'the required pattern: /^[a-z0-9]+$/');
                expect(body.error[3]).to.have.property('message').that.is.equal('"address" length must be at least 42 characters long');
                expect(body.error[4]).to.have.property('message').that.is.equal('"value" with value "false_value" fails to match the ' +
                    'required pattern: /^[a-zA-Z0-9]+$/');
                expect(body.error[5]).to.have.property('message').that.is.equal('"gas" must be a number');
                done(err);
            });
    });
});