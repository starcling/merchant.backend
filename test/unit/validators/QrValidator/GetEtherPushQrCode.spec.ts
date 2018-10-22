import * as chai from 'chai';
import {GetEtherPushQrCode} from '../../../../src/validators/QrValidator/GetEtherPushQrCode';

const tempQrValidator: any = require('../../../../resources/e2eTestData.json').qrValidator;
const validator = tempQrValidator['qrValidatorForEther'];

const expect = chai.expect;
const should = chai.should();

describe('A Get QR For Ethernet Validator Test', () => {
    let qrValidatorForEther: GetEtherPushQrCode;

    before(async () => {
        qrValidatorForEther = new GetEtherPushQrCode();
    });
    it('successful', () => {

        const tempValidator = {...validator};

        const results = qrValidatorForEther.validate(tempValidator);
        should.equal(results.error, null);
        expect(results.value).to.have.property('address').that.is.equal(tempValidator.address);
        expect(results.value).to.have.property('value').that.is.equal(tempValidator.value);
        expect(results.value).to.have.property('gas').that.is.equal(tempValidator.gas);
    });
    it('failure with invalid values', async () => {
        const tempValidator = {...validator};

        tempValidator.address = 'i726394782634957';
        tempValidator.value = '2364962378';
        tempValidator.gas = false;

        let results: any
        try {
            results = await qrValidatorForEther.validate(tempValidator);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 2);
            expect(err.error[0]).to.have.property('message').that.is.equal('"address" length must be at least 42 characters long');
            expect(err.error[1]).to.have.property('message').that.is.equal('"gas" must be a number');
        }
        should.equal(results, undefined);
    });
    it('failure with null values', async () => {
        const tempValidator = {...validator};

        tempValidator.address = null;
        tempValidator.value = null;
        tempValidator.gas = null;

        let results: any
        try {
            results = await qrValidatorForEther.validate(tempValidator);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 3);
            expect(err.error[0]).to.have.property('message').that.is.equal('"address" must be a string');
            expect(err.error[1]).to.have.property('message').that.is.equal('"value" must be a string');
            expect(err.error[2]).to.have.property('message').that.is.equal('"gas" must be a number');
        }
        should.equal(results, undefined);
    });
});