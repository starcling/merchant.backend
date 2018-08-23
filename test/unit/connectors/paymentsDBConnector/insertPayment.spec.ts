import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { IPaymentInsertDetails } from '../../../../src/core/payment/models';
import { MerchantSDK } from '../../../../src/core/MerchantSDK';
chai.use(chaiAsPromised);
chai.should();

let paymentDbConnector = new PaymentDbConnector();
const dataservice = new DataService();
const payments: any = require('../../../../resources/testData.json').payments;

const testInsertPayment: IPaymentInsertDetails = payments['insertTestPayment'];
var testID: string;

const clearTestPayment = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'DELETE FROM public.tb_payments WHERE id = $1;',
        values: [testID]
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A payment insert DBcontroller', () => {

    before(() => {
        MerchantSDK.GET_SDK().build({
            createPayment: paymentDbConnector.createPayment
        });
    }) 

    after(() => {
        MerchantSDK.GET_SDK().disconnectRedis();
    });

    afterEach(async () => {
        await clearTestPayment();
    });

    it('should insert a new payment', async () => {
        const result = await paymentDbConnector.createPayment(testInsertPayment);
        testID = result.data[0].id;
        result.should.have.property('success').that.is.equal(true);
        result.should.have.property('status').that.is.equal(201);
        result.should.have.property('message').that.is.equal('SQL Insert Query completed successful.');
        result.should.have.property('data').to.be.an('array');
        result.data[0].should.have.property('id');
        result.data[0].should.have.property('title').that.is.equal(testInsertPayment.title);
        result.data[0].should.have.property('description').that.is.equal(testInsertPayment.description);
        result.data[0].should.have.property('promo').that.is.equal(null);
        result.data[0].should.have.property('status').that.is.equal(1);
        result.data[0].should.have.property('customerAddress').that.is.equal(null);
        result.data[0].should.have.property('amount').that.is.equal(testInsertPayment.amount);
        result.data[0].should.have.property('currency').that.is.equal(testInsertPayment.currency);
        result.data[0].should.have.property('startTimestamp').that.is.equal(testInsertPayment.startTimestamp);
        result.data[0].should.have.property('endTimestamp').that.is.equal(testInsertPayment.endTimestamp);
        result.data[0].should.have.property('type').that.is.equal(testInsertPayment.type);
        result.data[0].should.have.property('frequency').that.is.equal(testInsertPayment.frequency);
        result.data[0].should.have.property('registerTxHash').that.is.equal(null);
        result.data[0].should.have.property('executeTxHash').that.is.equal(null);
        result.data[0].should.have.property('executeTxStatus').that.is.equal(1);
        result.data[0].should.have.property('merchantAddress').that.is.equal(testInsertPayment.merchantAddress);
        result.data[0].should.have.property('userId').that.is.equal(null);
    });

    it('should insert a new payment', async () => {
        const result = await MerchantSDK.GET_SDK().createPayment(testInsertPayment);
        testID = result.data[0].id;
        result.should.have.property('success').that.is.equal(true);
        result.should.have.property('status').that.is.equal(201);
        result.should.have.property('message').that.is.equal('SQL Insert Query completed successful.');
        result.should.have.property('data').to.be.an('array');
        result.data[0].should.have.property('id');
        result.data[0].should.have.property('title').that.is.equal(testInsertPayment.title);
        result.data[0].should.have.property('description').that.is.equal(testInsertPayment.description);
        result.data[0].should.have.property('promo').that.is.equal(null);
        result.data[0].should.have.property('status').that.is.equal(1);
        result.data[0].should.have.property('customerAddress').that.is.equal(null);
        result.data[0].should.have.property('amount').that.is.equal(testInsertPayment.amount);
        result.data[0].should.have.property('currency').that.is.equal(testInsertPayment.currency);
        result.data[0].should.have.property('startTimestamp').that.is.equal(testInsertPayment.startTimestamp);
        result.data[0].should.have.property('endTimestamp').that.is.equal(testInsertPayment.endTimestamp);
        result.data[0].should.have.property('type').that.is.equal(testInsertPayment.type);
        result.data[0].should.have.property('frequency').that.is.equal(testInsertPayment.frequency);
        result.data[0].should.have.property('registerTxHash').that.is.equal(null);
        result.data[0].should.have.property('executeTxHash').that.is.equal(null);
        result.data[0].should.have.property('executeTxStatus').that.is.equal(1);
        result.data[0].should.have.property('merchantAddress').that.is.equal(testInsertPayment.merchantAddress);
        result.data[0].should.have.property('userId').that.is.equal(null);
    });
});