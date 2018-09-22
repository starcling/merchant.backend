import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { EnumDbConnector } from '../../../../src/connectors/dbConnector/EnumDbConnector';
import { Globals } from '../../../../src/utils/globals';

chai.use(chaiAsPromised);
chai.should();

const enumDbConnector = new EnumDbConnector();

describe('A EnumDbConnector', () => {
    describe('With success request', () => {
        before(async () => {
            await Globals.REFRESH_ENUMS();
        })

        it('Should retrieve the payment types enum', async () => {
            const result = await enumDbConnector.getPaymentTypes();
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
        });

        it('Should retrieve the contract statuses enum', async () => {
            const result = await enumDbConnector.getContractStatuses();
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
        });

        it('Should retrieve the transaction types enum', async () => {
            const result = await enumDbConnector.getTransactionTypes();
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
        });

        it('Should retrieve the transaction statuses enum', async () => {
            const result = await enumDbConnector.getTransactionStatuses();
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
        });
    });
});