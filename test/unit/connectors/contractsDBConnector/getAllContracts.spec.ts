import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { IPaymentInsertDetails } from '../../../../src/core/payment/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { ContractDbConnector } from '../../../../src/connectors/dbConnector/ContractDbConnector';
import { IPaymentContractInsert } from '../../../../src/core/contract/models';

chai.use(chaiAsPromised);
chai.should();

const contractDbConnector = new ContractDbConnector();
const paymentDbConnector = new PaymentDbConnector();
const dataservice = new DataService();
const contracts: any = require('../../../../resources/testData.json').contracts;
const payments: any = require('../../../../resources/testData.json').payments;

const testInsertContract: IPaymentContractInsert = contracts['insertTestContract'];
const testInsertPayment: IPaymentInsertDetails = payments['insertTestPayment'];

const numberOfContracts = 8;

const insertTestPayment = async () => {
    const result = await paymentDbConnector.createPayment(testInsertPayment);
    testInsertContract.paymentID = result.data[0].id;
};

const clearTestPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payments WHERE id = $1;',
        values: [testInsertContract.paymentID]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A ContractDbConnector getAllContracts', () => {
    describe('With successfull request', () => {
        beforeEach(async () => {
            await insertTestPayment();
            for (let i = 0; i < numberOfContracts; i++) {
                await contractDbConnector.createContract(testInsertContract);
            }
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should retrieve the contract details for all records from DB connector', async () => {
            const result = await contractDbConnector.getAllContracts();
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data.length.should.be.at.least(numberOfContracts);
        });
    });
});