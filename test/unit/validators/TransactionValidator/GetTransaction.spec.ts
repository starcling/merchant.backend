import * as chai from 'chai';
import { GetTransactionValidator } from '../../../../src/validators/TransactionValidator/GetTransactionValidator';
import { Globals } from '../../../../src/utils/globals';

const tempTransactionModel: any = require('../../../../resources/e2eTestData.json').transactions;
const transaction = tempTransactionModel['getTestTransaction'];

const expect = chai.expect;

const should = chai.should();

describe('A Get Transaction Test', () => {
    let get: GetTransactionValidator;

    before(async () => {
        get = new GetTransactionValidator();
    });
    it('successful', () => {

        const tempTransaction = { ...transaction };

        const results = get.validate(tempTransaction);
        should.equal(results.error, null);
        expect(results.value).to.have.property('transactionHash').that.is.equal(tempTransaction.transactionHash);
        expect(results.value).to.have.property('pullPaymentID').that.is.equal(tempTransaction.pullPaymentID);
        expect(results.value).to.have.property('statusID').that.is.equal(tempTransaction.statusID);
        expect(results.value).to.have.property('typeID').that.is.equal(tempTransaction.typeID);
    });
    it('unsuccessfull case - with invalid values', () => {

        const tempTransaction = { ...transaction };

        tempTransaction.transactionHash = '0Xn9jaj46edm5oplfq6M8TA96221553588139c14ios01gqp5jcpqms3eo8m1r4mtl';
        tempTransaction.pullPaymentID = '23c534FE-8C97-11E8-B47F-9A38301a1e03';
        tempTransaction.statusID = false;
        tempTransaction.typeID = false;

        let results: any;
        try {
            results = get.validate(tempTransaction);
        } catch (err) {
            should.equal(err.status, 400);
            should.equal(err.success, false);
            should.equal(err.error.length, 4);
            expect(err.error[0]).to.have.property('message').that.contain(Globals.GET_TX_HASH_REG_EXPRESSION());
            expect(err.error[1]).to.have.property('message').that.contain(Globals.GET_UUID_REG_EXPRESSION());
            expect(err.error[2]).to.have.property('message').that.is.equal('"statusID" must be a number');
            expect(err.error[3]).to.have.property('message').that.is.equal('"typeID" must be a number');
        }
        should.equal(results, undefined);
    });
    it('successfull case - null values to every property', () => {

        const tempTransaction = { ...transaction };

        tempTransaction.transactionHash = null;
        tempTransaction.pullPaymentID = null;
        tempTransaction.statusID = null;
        tempTransaction.typeID = null;

        const results = get.validate(tempTransaction);
        should.equal(results.error, null);
        expect(results.value).to.have.property('transactionHash').that.is.equal(tempTransaction.transactionHash);
        expect(results.value).to.have.property('pullPaymentID').that.is.equal(tempTransaction.pullPaymentID);
        expect(results.value).to.have.property('statusID').that.is.equal(tempTransaction.statusID);
        expect(results.value).to.have.property('typeID').that.is.equal(tempTransaction.typeID);
    });
});