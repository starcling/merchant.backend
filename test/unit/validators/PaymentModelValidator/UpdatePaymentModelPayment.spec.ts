import * as chai from 'chai';
import {UpdatePaymentModelValidator} from '../../../../src/validators/PaymentModelValidator/UpdatePaymentModelValidator';

const tempPaymentModel: any = require('../../../../resources/e2eTestData.json').paymentModels;
const payment = tempPaymentModel['updatePaymentModel'];

const expect = chai.expect;

const should = chai.should();

describe('An Update PaymentModel Test', () => {
    let update: UpdatePaymentModelValidator;

    before(async () => {
        update = new UpdatePaymentModelValidator();
    });
    it('success when typeID is 1', () => {

        const tempPayment = {...payment};

        tempPayment.typeID = 1;
        tempPayment.numberOfPayments = 1;
        tempPayment.trialPeriod = 0;
        tempPayment.initialPaymentAmount = 0;

        const results = update.validate(tempPayment);
        should.equal(results.error, null);
        expect(results.value).to.have.property('id').that.is.equal(tempPayment.id);
        expect(results.value).to.have.property('title').that.is.equal(tempPayment.title);
        expect(results.value).to.have.property('description').that.is.equal(tempPayment.description);
        expect(results.value).to.have.property('amount').that.is.equal(tempPayment.amount);
        expect(results.value).to.have.property('initialPaymentAmount').that.is.equal(tempPayment.initialPaymentAmount);
        expect(results.value).to.have.property('numberOfPayments').that.is.equal(tempPayment.numberOfPayments);
        expect(results.value).to.have.property('trialPeriod').that.is.equal(tempPayment.trialPeriod);
        expect(results.value).to.have.property('currency').that.is.equal(tempPayment.currency);
        expect(results.value).to.have.property('typeID').that.is.equal(tempPayment.typeID);
        expect(results.value).to.have.property('frequency').that.is.equal(tempPayment.frequency);
        expect(results.value).to.have.property('networkID').that.is.equal(tempPayment.networkID);
        expect(results.value).to.have.property('automatedCashOut').that.is.equal(tempPayment.automatedCashOut);
        expect(results.value).to.have.property('cashOutFrequency').that.is.equal(tempPayment.cashOutFrequency);
    });

    it('failure when typeID is 1', () => {

        const tempPayment = {...payment};

        tempPayment.typeID = 1;
        tempPayment.numberOfPayments = 5;
        tempPayment.trialPeriod = 1;
        tempPayment.initialPaymentAmount = 1;

        let results: any
        try {
            results = update.validate(tempPayment);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 3);
            expect(err.error[0]).to.have.property('message').that.is.equal('"initialPaymentAmount" must be one of [0]');
            expect(err.error[1]).to.have.property('message').that.is.equal('"numberOfPayments" must be one of [1]');
            expect(err.error[2]).to.have.property('message').that.is.equal('"trialPeriod" must be one of [0]');
        }
        should.equal(results, undefined);
    });

    it('success when typeID is 2', () => {

        const tempPayment = {...payment};

        tempPayment.typeID = 2;
        tempPayment.numberOfPayments = 1;
        tempPayment.trialPeriod = 0;
        tempPayment.initialPaymentAmount = 0;

        const results = update.validate(tempPayment);
        should.equal(results.error, null);
        expect(results.value).to.have.property('id').that.is.equal(tempPayment.id);
        expect(results.value).to.have.property('title').that.is.equal(tempPayment.title);
        expect(results.value).to.have.property('description').that.is.equal(tempPayment.description);
        expect(results.value).to.have.property('amount').that.is.equal(tempPayment.amount);
        expect(results.value).to.have.property('initialPaymentAmount').that.is.equal(tempPayment.initialPaymentAmount);
        expect(results.value).to.have.property('numberOfPayments').that.is.equal(tempPayment.numberOfPayments);
        expect(results.value).to.have.property('trialPeriod').that.is.equal(tempPayment.trialPeriod);
        expect(results.value).to.have.property('currency').that.is.equal(tempPayment.currency);
        expect(results.value).to.have.property('typeID').that.is.equal(tempPayment.typeID);
        expect(results.value).to.have.property('frequency').that.is.equal(tempPayment.frequency);
        expect(results.value).to.have.property('networkID').that.is.equal(tempPayment.networkID);
        expect(results.value).to.have.property('automatedCashOut').that.is.equal(tempPayment.automatedCashOut);
        expect(results.value).to.have.property('cashOutFrequency').that.is.equal(tempPayment.cashOutFrequency);
    });

    it('failure when typeID is 2', () => {

        const tempPayment = {...payment};

        tempPayment.typeID = 2;
        tempPayment.numberOfPayments = 5;
        tempPayment.trialPeriod = 1;
        tempPayment.initialPaymentAmount = 1;

        let results: any
        try {
            results = update.validate(tempPayment);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 3);
            expect(err.error[0]).to.have.property('message').that.is.equal('"initialPaymentAmount" must be one of [0]');
            expect(err.error[1]).to.have.property('message').that.is.equal('"numberOfPayments" must be one of [1]');
            expect(err.error[2]).to.have.property('message').that.is.equal('"trialPeriod" must be one of [0]');
        }
        should.equal(results, undefined);
    });

    it('success when typeID is 3', () => {

        const tempPayment = {...payment};

        tempPayment.typeID = 3;
        tempPayment.numberOfPayments = 4;
        tempPayment.trialPeriod = 0;
        tempPayment.initialPaymentAmount = 0;

        const results = update.validate(tempPayment);
        should.equal(results.error, null);
        expect(results.value).to.have.property('id').that.is.equal(tempPayment.id);
        expect(results.value).to.have.property('title').that.is.equal(tempPayment.title);
        expect(results.value).to.have.property('description').that.is.equal(tempPayment.description);
        expect(results.value).to.have.property('amount').that.is.equal(tempPayment.amount);
        expect(results.value).to.have.property('initialPaymentAmount').that.is.equal(tempPayment.initialPaymentAmount);
        expect(results.value).to.have.property('numberOfPayments').that.is.equal(tempPayment.numberOfPayments);
        expect(results.value).to.have.property('trialPeriod').that.is.equal(tempPayment.trialPeriod);
        expect(results.value).to.have.property('currency').that.is.equal(tempPayment.currency);
        expect(results.value).to.have.property('typeID').that.is.equal(tempPayment.typeID);
        expect(results.value).to.have.property('frequency').that.is.equal(tempPayment.frequency);
        expect(results.value).to.have.property('networkID').that.is.equal(tempPayment.networkID);
        expect(results.value).to.have.property('automatedCashOut').that.is.equal(tempPayment.automatedCashOut);
        expect(results.value).to.have.property('cashOutFrequency').that.is.equal(tempPayment.cashOutFrequency);
    });

    it('failure when typeID is 3', () => {

        const tempPayment = {...payment};

        tempPayment.typeID = 3;
        tempPayment.numberOfPayments = 1;
        tempPayment.trialPeriod = 1;
        tempPayment.initialPaymentAmount = 1;

        let results: any
        try {
            results = update.validate(tempPayment);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 3);
            expect(err.error[0]).to.have.property('message').that.is.equal('"initialPaymentAmount" must be one of [0]');
            expect(err.error[1]).to.have.property('message').that.is.equal('"numberOfPayments" must be larger than or equal to 2');
            expect(err.error[2]).to.have.property('message').that.is.equal('"trialPeriod" must be one of [0]');
        }
        should.equal(results, undefined);
    });

    it('success when typeID is 4', () => {

        const tempPayment = {...payment};

        tempPayment.typeID = 4;
        tempPayment.numberOfPayments = 2;
        tempPayment.trialPeriod = 0;
        tempPayment.initialPaymentAmount = 1;

        const results = update.validate(tempPayment);
        should.equal(results.error, null);
        expect(results.value).to.have.property('id').that.is.equal(tempPayment.id);
        expect(results.value).to.have.property('title').that.is.equal(tempPayment.title);
        expect(results.value).to.have.property('description').that.is.equal(tempPayment.description);
        expect(results.value).to.have.property('amount').that.is.equal(tempPayment.amount);
        expect(results.value).to.have.property('initialPaymentAmount').that.is.equal(tempPayment.initialPaymentAmount);
        expect(results.value).to.have.property('numberOfPayments').that.is.equal(tempPayment.numberOfPayments);
        expect(results.value).to.have.property('trialPeriod').that.is.equal(tempPayment.trialPeriod);
        expect(results.value).to.have.property('currency').that.is.equal(tempPayment.currency);
        expect(results.value).to.have.property('typeID').that.is.equal(tempPayment.typeID);
        expect(results.value).to.have.property('frequency').that.is.equal(tempPayment.frequency);
        expect(results.value).to.have.property('networkID').that.is.equal(tempPayment.networkID);
        expect(results.value).to.have.property('automatedCashOut').that.is.equal(tempPayment.automatedCashOut);
        expect(results.value).to.have.property('cashOutFrequency').that.is.equal(tempPayment.cashOutFrequency);
    });

    it('failure when typeID is 4', () => {

        const tempPayment = {...payment};

        tempPayment.typeID = 4;
        tempPayment.numberOfPayments = 1;
        tempPayment.trialPeriod = 1;
        tempPayment.initialPaymentAmount = 0;

        let results: any
        try {
            results = update.validate(tempPayment);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 3);
            expect(err.error[0]).to.have.property('message').that.is.equal('"initialPaymentAmount" must be larger than or equal to 1');
            expect(err.error[1]).to.have.property('message').that.is.equal('"numberOfPayments" must be larger than or equal to 2');
            expect(err.error[2]).to.have.property('message').that.is.equal('"trialPeriod" must be one of [0]');
        }
        should.equal(results, undefined);
    });

    it('success when typeID is 5', () => {

        const tempPayment = {...payment};

        tempPayment.typeID = 5;
        tempPayment.numberOfPayments = 2;
        tempPayment.trialPeriod = 1;
        tempPayment.initialPaymentAmount = 0;

        const results = update.validate(tempPayment);
        should.equal(results.error, null);
        expect(results.value).to.have.property('id').that.is.equal(tempPayment.id);
        expect(results.value).to.have.property('title').that.is.equal(tempPayment.title);
        expect(results.value).to.have.property('description').that.is.equal(tempPayment.description);
        expect(results.value).to.have.property('amount').that.is.equal(tempPayment.amount);
        expect(results.value).to.have.property('initialPaymentAmount').that.is.equal(tempPayment.initialPaymentAmount);
        expect(results.value).to.have.property('numberOfPayments').that.is.equal(tempPayment.numberOfPayments);
        expect(results.value).to.have.property('trialPeriod').that.is.equal(tempPayment.trialPeriod);
        expect(results.value).to.have.property('currency').that.is.equal(tempPayment.currency);
        expect(results.value).to.have.property('typeID').that.is.equal(tempPayment.typeID);
        expect(results.value).to.have.property('frequency').that.is.equal(tempPayment.frequency);
        expect(results.value).to.have.property('networkID').that.is.equal(tempPayment.networkID);
        expect(results.value).to.have.property('automatedCashOut').that.is.equal(tempPayment.automatedCashOut);
        expect(results.value).to.have.property('cashOutFrequency').that.is.equal(tempPayment.cashOutFrequency);
    });

    it('failure when typeID is 5', () => {

        const tempPayment = {...payment};

        tempPayment.typeID = 5;
        tempPayment.numberOfPayments = 1;
        tempPayment.trialPeriod = 0;
        tempPayment.initialPaymentAmount = 1;

        let results: any
        try {
            results = update.validate(tempPayment);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 3);
            expect(err.error[0]).to.have.property('message').that.is.equal('"initialPaymentAmount" must be one of [0]');
            expect(err.error[1]).to.have.property('message').that.is.equal('"numberOfPayments" must be larger than or equal to 2');
            expect(err.error[2]).to.have.property('message').that.is.equal('"trialPeriod" must be larger than or equal to 1');
        }
        should.equal(results, undefined);
    });

    it('success when typeID is 6', () => {

        const tempPayment = {...payment};

        tempPayment.typeID = 6;
        tempPayment.numberOfPayments = 6;
        tempPayment.trialPeriod = 1;
        tempPayment.initialPaymentAmount = 1;

        const results = update.validate(tempPayment);
        should.equal(results.error, null);
        expect(results.value).to.have.property('id').that.is.equal(tempPayment.id);
        expect(results.value).to.have.property('title').that.is.equal(tempPayment.title);
        expect(results.value).to.have.property('description').that.is.equal(tempPayment.description);
        expect(results.value).to.have.property('amount').that.is.equal(tempPayment.amount);
        expect(results.value).to.have.property('initialPaymentAmount').that.is.equal(tempPayment.initialPaymentAmount);
        expect(results.value).to.have.property('numberOfPayments').that.is.equal(tempPayment.numberOfPayments);
        expect(results.value).to.have.property('trialPeriod').that.is.equal(tempPayment.trialPeriod);
        expect(results.value).to.have.property('currency').that.is.equal(tempPayment.currency);
        expect(results.value).to.have.property('typeID').that.is.equal(tempPayment.typeID);
        expect(results.value).to.have.property('frequency').that.is.equal(tempPayment.frequency);
        expect(results.value).to.have.property('networkID').that.is.equal(tempPayment.networkID);
        expect(results.value).to.have.property('automatedCashOut').that.is.equal(tempPayment.automatedCashOut);
        expect(results.value).to.have.property('cashOutFrequency').that.is.equal(tempPayment.cashOutFrequency);
    });

    it('failure when typeID is 6', () => {

        const tempPayment = {...payment};

        tempPayment.typeID = 6;
        tempPayment.numberOfPayments = 1;
        tempPayment.trialPeriod = 0;
        tempPayment.initialPaymentAmount = 0;

        let results: any
        try {
            results = update.validate(tempPayment);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 3);
            expect(err.error[0]).to.have.property('message').that.is.equal('"initialPaymentAmount" must be larger than or equal to 1');
            expect(err.error[1]).to.have.property('message').that.is.equal('"numberOfPayments" must be larger than or equal to 2');
            expect(err.error[2]).to.have.property('message').that.is.equal('"trialPeriod" must be larger than or equal to 1');
        }
        should.equal(results, undefined);
    });

    it('failure - false values to every property', () => {

        const tempPayment = {...payment};

        tempPayment.id = '63c684fep8a97-11e8-b99f-9f38301a1e03';
        tempPayment.title = '123456789012345678901234567890123456789012345678901234567890123';
        tempPayment.description = 45;
        tempPayment.amount = 'false amount';
        tempPayment.numberOfPayments = 1;
        tempPayment.trialPeriod = 0;
        tempPayment.currency = 'EURO';
        tempPayment.initialPaymentAmount = 0;
        tempPayment.typeID = 'false';
        tempPayment.frequency = 0;
        tempPayment.networkID = 'false network';
        tempPayment.automatedCashOut = 2;
        tempPayment.cashOutFrequency = 5;

        let results: any
        try {
            results = update.validate(tempPayment);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 10);
            expect(err.error[0]).to.have.property('message').that.is.equal('"id" with value ' + '"63c684fep8a97-11e8-b99f-9f38301a1e03"' +
                ' fails to match the required pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/');
            expect(err.error[1]).to.have.property('message').that.is.equal('"title" length must be less than or equal to ' +
                '50 characters long');
            expect(err.error[2]).to.have.property('message').that.is.equal('"description" must be a string');
            expect(err.error[3]).to.have.property('message').that.is.equal('"amount" must be a number');
            expect(err.error[4]).to.have.property('message').that.is.equal('"currency" must be one of [USD, JPY, EUR, GBP]');
            expect(err.error[5]).to.have.property('message').that.is.equal('"currency" length must be less than or equal to 3 characters ' +
                'long');
            expect(err.error[6]).to.have.property('message').that.is.equal('"typeID" must be a number');
            expect(err.error[7]).to.have.property('message').that.is.equal('"frequency" must be larger than or equal to 1');
            expect(err.error[8]).to.have.property('message').that.is.equal('"networkID" must be a number');
            expect(err.error[9]).to.have.property('message').that.is.equal('"automatedCashOut" must be a boolean');
        }
        should.equal(results, undefined);
    });

    it('failure - null values to every property', () => {

        const tempPayment = {...payment};

        tempPayment.id = null;
        tempPayment.title = null;
        tempPayment.description = null;
        tempPayment.amount = null;
        tempPayment.numberOfPayments = null;
        tempPayment.trialPeriod = null;
        tempPayment.currency = null;
        tempPayment.initialPaymentAmount = null;
        tempPayment.typeID = null;
        tempPayment.frequency = null;
        tempPayment.networkID = null;
        tempPayment.automatedCashOut = null;
        tempPayment.cashOutFrequency = null;

        let results: any
        try {
            results = update.validate(tempPayment);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 13);
            expect(err.error[0]).to.have.property('message').that.is.equal('"id" must be a string');
            expect(err.error[1]).to.have.property('message').that.is.equal('"title" must be a string');
            expect(err.error[2]).to.have.property('message').that.is.equal('"description" must be a string');
            expect(err.error[3]).to.have.property('message').that.is.equal('"amount" must be a number');
            expect(err.error[4]).to.have.property('message').that.is.equal('"currency" must be a string');
            expect(err.error[5]).to.have.property('message').that.is.equal('"typeID" must be a number');
            expect(err.error[6]).to.have.property('message').that.is.equal('"initialPaymentAmount" must be a number');
            expect(err.error[7]).to.have.property('message').that.is.equal('"numberOfPayments" must be a number');
            expect(err.error[8]).to.have.property('message').that.is.equal('"trialPeriod" must be a number');
            expect(err.error[9]).to.have.property('message').that.is.equal('"frequency" must be a number');
            expect(err.error[10]).to.have.property('message').that.is.equal('"networkID" must be a number');
            expect(err.error[11]).to.have.property('message').that.is.equal('"automatedCashOut" must be a boolean');
            expect(err.error[12]).to.have.property('message').that.is.equal('"cashOutFrequency" must be a number');
        }
        should.equal(results, undefined);
    });
});
