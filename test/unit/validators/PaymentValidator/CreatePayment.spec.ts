import * as chai from 'chai';
import sinon from 'sinon';
import {CreatePaymentValidator} from '../../../../src/validators/PaymentValidator/CreatePaymentValidator';
import {PaymentModelDbConnector} from '../../../../src/connectors/dbConnector/PaymentModelDbConnector';

const tempPaymentModel: any = require('../../../../resources/e2eTestData.json').payments;
const payment = tempPaymentModel['insertTestPayment'];

const expect = chai.expect;

const should = chai.should();

describe('A Create Payment Test', () => {
    let create: CreatePaymentValidator;

    before(() => {
        create = new CreatePaymentValidator();
        sinon.stub(PaymentModelDbConnector.prototype, 'getPaymentModelByID').callsFake(() => undefined);
    });
    it('success with valid values', async () => {
        const tempPayment = {...payment};
        const results = await create.validate(tempPayment);
        expect(results).to.have.property('pullPaymentModelID').that.is.equal(tempPayment.pullPaymentModelID);
        expect(results).to.have.property('numberOfPayments').that.is.equal(tempPayment.numberOfPayments);
        expect(results).to.have.property('startTimestamp').that.is.equal(tempPayment.startTimestamp);
        expect(results).to.have.property('customerAddress').that.is.equal(tempPayment.customerAddress);
        expect(results).to.have.property('pullPaymentAddress').that.is.equal(tempPayment.pullPaymentAddress);
        expect(results).to.have.property('userID').that.is.equal(tempPayment.userID);
    });
    it('failure with invalid values', async () => {
        const tempPayment = {...payment};

        tempPayment.pullPaymentModelID = '63c684fe-8a97-11e8-b99f59f38301a1e03';
        tempPayment.numberOfPayments = 0;
        tempPayment.startTimestamp = '1';
        tempPayment.customerAddress = '0X0000000000000000000000000000000000000000';
        tempPayment.pullPaymentAddress = '0x000000000000000p000000p000000000000000000';
        tempPayment.userID = '23c534fe-8c97-11e82b47f-9a38301a1e03';

        let results: any
        try {
            results = await create.validate(tempPayment);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 5);
            expect(err.error[0]).to.have.property('message').that.is.equal('"pullPaymentModelID" with value "63c684fe-8a97-11e8-' +
                'b99f59f38301a1e03" fails to match the required pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/');
            expect(err.error[1]).to.have.property('message').that.is.equal('"numberOfPayments" must be larger than or equal to 1');
            expect(err.error[2]).to.have.property('message').that.is.equal('"customerAddress" with value ' +
                '"0X0000000000000000000000000000000000000000" fails to match the required pattern: /^[a-z0-9]+$/');
            expect(err.error[3]).to.have.property('message').that.is.equal('"pullPaymentAddress" ' +
                'length must be less than or equal to 42 characters long');
            expect(err.error[4]).to.have.property('message').that.is.equal('"userID" with value "23c534fe-8c97-11e82b47f-9a38301a1e03" ' +
                'fails to match the required pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/');
        }
        should.equal(results, undefined);
    });
    it('failure with null values', async () => {
        const tempPayment = {...payment};

        tempPayment.pullPaymentModelID = null;
        tempPayment.numberOfPayments = null;
        tempPayment.startTimestamp = null;
        tempPayment.customerAddress = null;
        tempPayment.pullPaymentAddress = null;
        tempPayment.userID = null;

        let results: any
        try {
            results = await create.validate(tempPayment);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 5);
            expect(err.error[0]).to.have.property('message').that.is.equal('"pullPaymentModelID" must be a string');
            expect(err.error[1]).to.have.property('message').that.is.equal('"numberOfPayments" must be a number');
            expect(err.error[2]).to.have.property('message').that.is.equal('"startTimestamp" must be a number');
            expect(err.error[3]).to.have.property('message').that.is.equal('"customerAddress" must be a string');
            expect(err.error[4]).to.have.property('message').that.is.equal('"pullPaymentAddress" must be a string');
        }
        should.equal(results, undefined);
    });
});