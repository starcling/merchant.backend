import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { IPaymentInsertDetails } from '../../../../src/core/payment/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { MerchantSDK } from '../../../../src/core/MerchantSDK';
import { ContractDbConnector } from '../../../../src/connectors/dbConnector/ContractDbConnector';
import { EnumDbConnector } from '../../../../src/connectors/dbConnector/EnumDbConnector';
import { IPaymentContractInsert, IPaymentContractUpdate } from '../../../../src/core/contract/models';
import { Globals } from '../../../../src/utils/globals';

chai.use(chaiAsPromised);
chai.should();

const contractDbConnector = new ContractDbConnector();
const paymentDbConnector = new PaymentDbConnector();
const enumDbConnector = new EnumDbConnector();
const dataservice = new DataService();
const contracts: any = require('../../../../resources/testData.json').contracts;
const payments: any = require('../../../../resources/testData.json').payments;

const testInsertContract: IPaymentContractInsert = contracts['insertTestContract'];
const testUpdateContract: IPaymentContractUpdate = contracts['updateTestContract'];
const testInsertPayment: IPaymentInsertDetails = payments['insertTestPayment'];

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

describe('A contractDbConnector', () => {
    describe('Get contract details', () => {
        before(() => {
            MerchantSDK.GET_SDK().build({
                getPayment: contractDbConnector.getContract
            });
        });
        after(() => {
            MerchantSDK.GET_SDK().disconnectRedis();
        });
        beforeEach(async () => {
            await insertTestPayment();
            const result = await contractDbConnector.createContract(testInsertContract);
            testUpdateContract.id = result.data[0].id;
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should retrieve the contract details for a single record', async () => {
            await Globals.REFRESH_ENUMS();

            const contractStatuses = Globals.GET_CONTRACT_STATUS_ENUM();
            const paymentTypes = Globals.GET_PAYMENT_TYPE_ENUM();
            
            const result = await contractDbConnector.getContract(testUpdateContract.id);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('title').that.is.equal(testInsertPayment.title);
            result.data[0].should.have.property('description').that.is.equal(testInsertPayment.description);
            result.data[0].should.have.property('amount').that.is.equal(testInsertPayment.amount);
            result.data[0].should.have.property('initialPaymentAmount').that.is.equal(testInsertPayment.initialPaymentAmount);
            result.data[0].should.have.property('currency').that.is.equal(testInsertPayment.currency);
            result.data[0].should.have.property('numberOfPayments').that.is.equal(testInsertContract.numberOfPayments);
            result.data[0].should.have.property('frequency').that.is.equal(testInsertPayment.frequency);
            result.data[0].should.have.property('type').that.is.equal(paymentTypes[testInsertPayment.typeID]);
            result.data[0].should.have.property('status').that.is.equal(contractStatuses[testInsertContract.statusID]);
            result.data[0].should.have.property('networkID').that.is.equal(testInsertPayment.networkID);
            result.data[0].should.have.property('nextPaymentDate').that.is.equal(testInsertContract.nextPaymentDate.toString());
            result.data[0].should.have.property('lastPaymentDate').that.is.equal(testInsertContract.lastPaymentDate.toString());
            result.data[0].should.have.property('startTimestamp').that.is.equal(testInsertContract.startTimestamp.toString());
            result.data[0].should.have.property('pullPaymentAddress').that.is.equal(testInsertContract.pullPaymentAddress);
            result.data[0].should.have.property('userID').that.is.equal(testInsertContract.userID);
        });
        it('Should retrieve the contract details for a single record', async () => {
            await Globals.REFRESH_ENUMS();

            const contractStatuses = Globals.GET_CONTRACT_STATUS_ENUM();
            const paymentTypes = Globals.GET_PAYMENT_TYPE_ENUM();

            const result = await MerchantSDK.GET_SDK().getPayment(testUpdateContract.id);
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data[0].should.have.property('id');
            result.data[0].should.have.property('title').that.is.equal(testInsertPayment.title);
            result.data[0].should.have.property('description').that.is.equal(testInsertPayment.description);
            result.data[0].should.have.property('amount').that.is.equal(testInsertPayment.amount);
            result.data[0].should.have.property('initialPaymentAmount').that.is.equal(testInsertPayment.initialPaymentAmount);
            result.data[0].should.have.property('currency').that.is.equal(testInsertPayment.currency);
            result.data[0].should.have.property('numberOfPayments').that.is.equal(testInsertContract.numberOfPayments);
            result.data[0].should.have.property('frequency').that.is.equal(testInsertPayment.frequency);
            result.data[0].should.have.property('type').that.is.equal(paymentTypes[testInsertPayment.typeID]);
            result.data[0].should.have.property('status').that.is.equal(contractStatuses[testInsertContract.statusID]);
            result.data[0].should.have.property('networkID').that.is.equal(testInsertPayment.networkID);
            result.data[0].should.have.property('nextPaymentDate').that.is.equal(testInsertContract.nextPaymentDate.toString());
            result.data[0].should.have.property('lastPaymentDate').that.is.equal(testInsertContract.lastPaymentDate.toString());
            result.data[0].should.have.property('startTimestamp').that.is.equal(testInsertContract.startTimestamp.toString());
            result.data[0].should.have.property('pullPaymentAddress').that.is.equal(testInsertContract.pullPaymentAddress);
            result.data[0].should.have.property('userID').that.is.equal(testInsertContract.userID);
        });
    });
});