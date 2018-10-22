import * as chai from 'chai';
import {GetQrValidator} from '../../../../src/validators/QrValidator/GetQrValidator';

const tempQrValidator: any = require('../../../../resources/e2eTestData.json').qrValidator;
const validator = tempQrValidator['getQrValidator'];

const expect = chai.expect;

const should = chai.should();

describe('A Get QR Validator Test', () => {
    let getQrValidator: GetQrValidator;

    before(async () => {
        getQrValidator = new GetQrValidator();
    });
    it('successful', () => {

        const tempValidator = {...validator};

        const results = getQrValidator.validate(tempValidator);
        should.equal(results.error, null);
        expect(results.value).to.have.property('paymentID').that.is.equal(tempValidator.paymentID);
    });
    it('unsuccessfull case - false "pullPaymentID" format with more than 36 characters', () => {
        const tempValidator = {...validator};

        tempValidator.paymentID = '63c4fe-8a97e4-11e8-b99fgb-9f38301esdfsdfsdfs03';

        let results: any
        try {
            results = getQrValidator.validate(tempValidator);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 2);
            expect(err.error[0]).to.have.property('message').that.is.equal('"paymentID" with value "63c4fe-8a97e4-11e8-b99fgb-9f38301' +
                'esdfsdfsdfs03" fails to match the required pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/');
            expect(err.error[1]).to.have.property('message').that.is.equal('"paymentID" length must be less than or equal to 36 ' +
                'characters long');
        }
        should.equal(results, undefined);
    });
    it('unsuccessfull case - null "pullPaymentID" value', () => {
        const tempValidator = {...validator};

        tempValidator.paymentID = null;

        let results: any
        try {
            results = getQrValidator.validate(tempValidator);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 1);
            expect(err.error[0]).to.have.property('message').that.is.equal('"paymentID" must be a string');
        }
        should.equal(results, undefined);
    });
});