import * as chai from 'chai';
import {GetPaymentModelValidator} from '../../../../src/validators/PaymentModelValidator/GetPaymentModelValidator';

const tempPaymentModel: any = require('../../../../resources/e2eTestData.json').paymentModels;
const payment = tempPaymentModel['getPaymentModel'];

const expect = chai.expect;

const should = chai.should();

describe('A Get PaymentModel Test', () => {
    let get: GetPaymentModelValidator;

    before(async () => {
        get = new GetPaymentModelValidator();
    });
    it('success case', () => {
        const results = get.validate(payment);
        should.equal(results.error, null);
        expect(results.value).to.have.property('pullPaymentModelID').that.is.equal(payment.pullPaymentModelID);
    });
    it('unsuccessfull case - less than 36 characters', () => {
        const tempPayment = {...payment};

        tempPayment.pullPaymentModelID = '63fe-8a97e4-11e8-b99fgb-9f383e03';

        let results: any
        try {
            results = get.validate(tempPayment);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 2);
            expect(err.error[0]).to.have.property('message').that.is.equal('"pullPaymentModelID" with value "63fe-8a97e4-11e8-b99fgb-' +
                '9f383e03" fails to match the required pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/');
            expect(err.error[1]).to.have.property('message').that.is.equal('"pullPaymentModelID" length must be at least 36 characters ' +
                'long');
        }
        should.equal(results, undefined);
    });
    it('unsuccessfull case - false "pullPaymentModelID" format"', () => {
        const tempPayment = {...payment};

        tempPayment.pullPaymentModelID = '63c4fe-8a97e4-11e8-b99fgb-9f38301e03';

        let results: any
        try {
            results = get.validate(tempPayment);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 1);
            expect(err.error[0]).to.have.property('message').that.is.equal('"pullPaymentModelID" with value "63c4fe-8a97e4-11e8-b99fgb-' +
                '9f38301e03" fails to match the required pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/');
        }
        should.equal(results, undefined);
    });
    it('unsuccessfull case - null "pullPaymentModelID" value', () => {
        const tempPayment = {...payment};

        tempPayment.pullPaymentModelID = null;

        let results: any
        try {
            results = get.validate(tempPayment);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 1);
            expect(err.error[0]).to.have.property('message').that.is.equal('"pullPaymentModelID" must be a string');
        }
        should.equal(results, undefined);
    });
});