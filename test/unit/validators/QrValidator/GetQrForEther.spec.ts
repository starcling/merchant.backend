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
});