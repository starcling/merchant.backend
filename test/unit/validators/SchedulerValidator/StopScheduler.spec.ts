import * as chai from 'chai';
import {StopSchedulerValidator} from '../../../../src/validators/SchedulerValidator/StopSchedulerValidator';

const tempScheduler: any = require('../../../../resources/e2eTestData.json').scheduler;
const scheduler = tempScheduler['stopSqcheduler'];

const expect = chai.expect;

const should = chai.should();

describe('A Stop Sceduler Test', () => {
    let stopScheduler: StopSchedulerValidator;

    before(async () => {
        stopScheduler = new StopSchedulerValidator();
    });
    it('successful', () => {

        const tempStopScheduler = {...scheduler};

        const results = stopScheduler.validate(tempStopScheduler);
        should.equal(results.error, null);
        expect(results.value).to.have.property('paymentID').that.is.equal(tempStopScheduler.paymentID);
    });
    it('unsuccessfull case - false "pullPaymentID" format with more than 36 characters', () => {
        const tempStopScheduler = {...scheduler};

        tempStopScheduler.paymentID = '63c4fe-8a97e4-11e8-b99fgb-9f38301esdfsdfsdfs03';

        let results: any
        try {
            results = stopScheduler.validate(tempStopScheduler);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 2);
            expect(err.error[0]).to.have.property('message').that.is.equal('"paymentID" with value "63c4fe-8a97e4-11e8-b99fgb-9f3830' +
                '1esdfsdfsdfs03" fails to match the required pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/');
            expect(err.error[1]).to.have.property('message').that.is.equal('"paymentID" length must be less than or equal to 36 ' +
                'characters long');
        }
        should.equal(results, undefined);
    });
    it('unsuccessfull case - null "pullPaymentID" value', () => {
        const tempStopScheduler = {...scheduler};

        tempStopScheduler.paymentID = null;

        let results: any
        try {
            results = stopScheduler.validate(tempStopScheduler);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 1);
            expect(err.error[0]).to.have.property('message').that.is.equal('"paymentID" must be a string');
        }
        should.equal(results, undefined);
    });
});