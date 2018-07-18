import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentDbConnector } from '../../../../../src/connectors/dbConnector/paymentsDBconnector';
import { DataService, ISqlQuery } from '../../../../../src/utils/datasource/DataService';
import { IPaymentInsertDetails } from '../../../../../src/core/payment/models';
chai.use(chaiAsPromised);
chai.should();

let paymentDbConnector = new PaymentDbConnector();
const dataservice = new DataService();
const payments: any = require('../../../../../resources/testData.json').payments; 

const testInsertPayment: IPaymentInsertDetails = payments['insertTestPayment'];
var testID: string;

const clearTestPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payments WHERE id = $1;',
        values: [testID]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
}

describe('A payment insert DBcontroller', () => {
    afterEach(async () => {
        await clearTestPayment();
    });

    it('should insert a new payment', async () => {
        const result = await paymentDbConnector.insertPayment(testInsertPayment);
        testID = result.data[0].id;
        result.should.have.property('success').that.is.equal(true);
        result.should.have.property('status').that.is.equal(200);
        result.should.have.property('message').that.is.equal('SQL Query completed successful.');
        result.should.have.property('data').to.be.an('array');
        result.data[0].should.have.property('id');
        result.data[0].should.have.property('title').that.is.equal(testInsertPayment.title);
        result.data[0].should.have.property('description').that.is.equal(testInsertPayment.description);
        result.data[0].should.have.property('promo').that.is.equal(null);
        result.data[0].should.have.property('status').that.is.equal(testInsertPayment.status);
        result.data[0].should.have.property('customerAddress').that.is.equal(null);
        result.data[0].should.have.property('amount').that.is.equal(testInsertPayment.amount);
        result.data[0].should.have.property('currency').that.is.equal(testInsertPayment.currency);
        result.data[0].should.have.property('startTS').that.is.equal(testInsertPayment.startts);
        result.data[0].should.have.property('endTS').that.is.equal(testInsertPayment.endts);
        result.data[0].should.have.property('type').that.is.equal(testInsertPayment.type);
        result.data[0].should.have.property('frequency').that.is.equal(testInsertPayment.frequency);
        result.data[0].should.have.property('transactionHash').that.is.equal(null);
        result.data[0].should.have.property('debitAccount').that.is.equal(null);
    });
});