import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentModelDbConnector } from '../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { IPaymentModelInsertDetails } from '../../../../src/core/paymentModel/models';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { IPaymentInsert } from '../../../../src/core/payment/models';

chai.use(chaiAsPromised);
chai.should();

const contractDbConnector = new PaymentDbConnector();
const paymentDbConnector = new PaymentModelDbConnector();
const dataservice = new DataService();

const payments: any = require('../../../../resources/testData.json').payments;
const paymentModels: any = require('../../../../resources/testData.json').paymentModels;

const testInsertPayment: IPaymentInsert = payments['insertTestPayment'];
const testInsertPaymentModel: IPaymentModelInsertDetails = paymentModels['insertTestPaymentModel'];

const numberOfContracts = 8;
const max = 1e+52;
const min = 1e+10;

const insertTestPayment = async () => {
    const result = await paymentDbConnector.createPaymentModel(testInsertPaymentModel);
    testInsertPayment.pullPaymentModelID = result.data[0].id;
};

const clearTestPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payment_models WHERE id = $1;',
        values: [testInsertPayment.pullPaymentModelID]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A PaymentDbConnector getAllPayments', () => {
    describe('With successfull request', () => {
        beforeEach(async () => {
            await insertTestPayment();
            for (let i = 0; i < numberOfContracts; i++) {
                testInsertPayment.customerAddress = (Math.floor((Math.random() * max) - min) + min).toString();
                await contractDbConnector.createPayment(testInsertPayment);
            }
        });
        afterEach(async () => {
            await clearTestPayment();
        });
        it('Should retrieve the payment details for all records from DB connector', async () => {
            const result = await contractDbConnector.getAllPayments();
            result.should.have.property('success').that.is.equal(true);
            result.should.have.property('status').that.is.equal(200);
            result.should.have.property('message').that.is.equal('SQL Query completed successful.');
            result.should.have.property('data').that.is.an('array');
            result.data.length.should.be.at.least(numberOfContracts);
        });
    });
});