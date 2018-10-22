import * as chai from 'chai';
import {GetErc20PushQrCode} from '../../../../src/validators/QrValidator/GetErc20PushQrCode';

const tempQrValidator: any = require('../../../../resources/e2eTestData.json').qrValidator;
const validator = tempQrValidator['qrValidatorForErc20'];

const expect = chai.expect;

const should = chai.should();

describe('A Get QR For Erc20 Validator Test', () => {
    let qrValidatorForErc20: GetErc20PushQrCode;

    before(async () => {
        qrValidatorForErc20 = new GetErc20PushQrCode();
    });
    it('successful', () => {
        const tempValidator = {...validator};

        const results = qrValidatorForErc20.validate(tempValidator);
        should.equal(results.error, null);
        expect(results.value).to.have.property('tokenAddress').that.is.equal(tempValidator.tokenAddress);
        expect(results.value).to.have.property('address').that.is.equal(tempValidator.address);
        expect(results.value).to.have.property('value').that.is.equal(tempValidator.value);
        expect(results.value).to.have.property('gas').that.is.equal(tempValidator.gas);
    });
});