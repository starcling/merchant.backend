import * as chai from 'chai';
import { DeletePaymentValidator } from '../../../../src/validators/PaymentValidator/DeletePaymentValidator';

const tempPaymentModel: any = require('../../../../resources/e2eTestData.json').payments;
const payment = tempPaymentModel['deleteTestPayment'];

const expect = chai.expect;

const should = chai.should();

describe('A Delete Payment Test', () => {
    let deleteP: DeletePaymentValidator;

    before(() => {
        deleteP = new DeletePaymentValidator();
    });
    it('success with valid values', () => {
        const tempPayment = {...payment};
        const results = deleteP.validate(tempPayment);
        expect(results.value).to.have.property('paymentID').that.is.equal(tempPayment.paymentID);
    });
    it('unsuccessfull case - false "pullPaymentID" format with more than 36 characters', () => {
        const tempPayment = {...payment};

        tempPayment.paymentID = '63c4fe-8a97e4-11e8-b99fgb-9f38301esdfsdfsdfs03';

        let results: any
        try {
            results = deleteP.validate(tempPayment);
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
        const tempPayment = {...payment};

        tempPayment.paymentID = null;

        let results: any
        try {
            results = deleteP.validate(tempPayment);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 1);
            expect(err.error[0]).to.have.property('message').that.is.equal('"paymentID" must be a string');
        }
        should.equal(results, undefined);
    });
});