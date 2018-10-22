import * as chai from 'chai';
import {CreateTransactionValidator} from '../../../../src/validators/TransactionValidator/CreateTransactionValidator';

const tempTransactionModel: any = require('../../../../resources/e2eTestData.json').transactions;
const transaction = tempTransactionModel['createTestTransaction'];

const expect = chai.expect;

const should = chai.should();

describe('A Create Transaction Test', () => {
    let create: CreateTransactionValidator;

    before(async () => {
        create = new CreateTransactionValidator();
    });
    it('successful', () => {

        const tempTransaction = {...transaction};

        const results = create.validate(tempTransaction);
        should.equal(results.error, null);
        expect(results.value).to.have.property('hash').that.is.equal(tempTransaction.hash);
        expect(results.value).to.have.property('paymentID').that.is.equal(tempTransaction.paymentID);
        expect(results.value).to.have.property('typeID').that.is.equal(tempTransaction.typeID);
        expect(results.value).to.have.property('timestamp').that.is.equal(tempTransaction.timestamp);
    });
    it('unsuccessfull case - with invalid values', () => {

        const tempTransaction = {...transaction};

        tempTransaction.hash = '0Xn9jaj46edm5oplfq6M8TA96221553588139c14ios01gqp5jcpqms3eo8m1r4mtl';
        tempTransaction.paymentID = '23c534FE-8C97-11E8-B47F-9A38301a1e03';
        tempTransaction.typeID = false;
        tempTransaction.timestamp = false;

        let results: any
        try {
            results = create.validate(tempTransaction);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 4);
            expect(err.error[0]).to.have.property('message').that.is.equal('"hash" with value ' +
                '"0Xn9jaj46edm5oplfq6M8TA96221553588139c14ios01gqp5jcpqms3eo8m1r4mtl" fails to match the required pattern: /^[a-z0-9]+$/');
            expect(err.error[1]).to.have.property('message').that.is.equal('"paymentID" with value "23c534FE-8C97-11E8-B47F-9A38301a1e03"' +
                ' fails to match the required pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/');
            expect(err.error[2]).to.have.property('message').that.is.equal('"typeID" must be a number');
            expect(err.error[3]).to.have.property('message').that.is.equal('"timestamp" must be a number');
        }
        should.equal(results, undefined);
    });
    it('unsuccessfull case - null values to every property', () => {

        const tempTransaction = {...transaction};

        tempTransaction.hash = null;
        tempTransaction.paymentID = null;
        tempTransaction.typeID = null;
        tempTransaction.timestamp = null;

        let results: any
        try {
            results = create.validate(tempTransaction);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 4);
            expect(err.error[0]).to.have.property('message').that.is.equal('"hash" must be a string');
            expect(err.error[1]).to.have.property('message').that.is.equal('"paymentID" must be a string');
            expect(err.error[2]).to.have.property('message').that.is.equal('"typeID" must be a number');
            expect(err.error[3]).to.have.property('message').that.is.equal('"timestamp" must be a number');
        }
        should.equal(results, undefined);
    });
});