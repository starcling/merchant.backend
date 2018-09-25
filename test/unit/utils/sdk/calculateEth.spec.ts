import * as chai from 'chai';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { MerchantSDK } from '../../../../src/core/MerchantSDK';
import { Globals } from '../../../../src/utils/globals';
import { PrivateKeysDbConnector } from '../../../../src/connectors/dbConnector/PrivateKeysDbConnector';
import { IPaymentInsert, IPaymentUpdate } from '../../../../src/core/payment/models';
import { IPaymentModelInsertDetails } from '../../../../src/core/paymentModel/models';
import { PaymentModelDbConnector } from '../../../../src/connectors/dbConnector/PaymentModelDbConnector';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';

const web3 = require('web3');

chai.use(require('chai-match'));

const expect = chai.expect;
const web3API = new web3(new web3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(3)));

const paymentDbConnector = new PaymentDbConnector();
const paymentModelDbConnector = new PaymentModelDbConnector();
const dataservice = new DataService();
const payments: any = require('../../../../resources/testData.json').payments;
const paymentModels: any = require('../../../../resources/testData.json').paymentModels;

const testInsertPayment: IPaymentInsert = payments['insertTestPayment'];
const testUpdatePayment: IPaymentUpdate = payments['updateTestPayment'];
const testInsertPaymentModel: IPaymentModelInsertDetails = paymentModels['insertTestPaymentModel'];

const insertTestPayment = async () => {
    const result = await paymentModelDbConnector.createPaymentModel(testInsertPaymentModel);
    testInsertPayment.pullPaymentModelID = result.data[0].id;
};

const clearTestPayment = async () => {
    paymentModelDbConnector.deletePaymentModel(testInsertPayment.pullPaymentModelID);
};

describe('A SDK calculateEth', () => {

    before(() => {
        MerchantSDK.GET_SDK().build({
            web3: web3API,
            updatePullPayment: paymentDbConnector.updatePayment,
            getPullPayment: paymentDbConnector.getPaymentByID,
            getPrivateKey: new PrivateKeysDbConnector().getPrivateKey
        });
    })

    after(() => {
        MerchantSDK.GET_SDK().disconnectRedis();
    });

    beforeEach(async () => {
        await insertTestPayment();
        testInsertPayment.customerAddress = '0x9d11DDd84198B30E56E31Aa89227344Cdb645e34';
        testInsertPayment.merchantAddress = '0x8AEcFd4a6657bdB8Ca125fBc682C97Da4ea78f8f';
        testInsertPayment.pullPaymentAddress = '0x7990fc1d2527d00c22db4c2b72e3e74f80b97d9c';
        const result = await paymentDbConnector.createPayment(testInsertPayment);
        testUpdatePayment.id = result.data[0].id;
    });
    afterEach(async () => {
        await clearTestPayment();
    });

    it('should calculate transfer fee eth gas needed', async () => {
        const amount = '20';
        const rate = 0.0007862;
        const value = web3API.utils.toWei(((Number(amount) / 100) / rate).toString());
        const result = await MerchantSDK.GET_SDK().calculateTransferFee(testInsertPayment.merchantAddress, testInsertPayment.customerAddress, value);
        expect(result).to.be.lessThan(100000).and.greaterThan(0);
    });

    it('should calculate max eth gas needed for execution (60s)', async () => {
        const result = await MerchantSDK.GET_SDK().calculateMaxExecutionFee();
        expect(result).to.be.greaterThan(0);
    }).timeout(60000);

    it('should calculate eth gas needed', async () => {
        const result = await MerchantSDK.GET_SDK().calculateWeiToFund(testUpdatePayment.id, testInsertPayment.customerAddress);

        const amount = '20';
        const rate = 0.0007862;
        const value = web3API.utils.toWei(((Number(amount) / 100) / rate).toString());;
        const transferFee = await MerchantSDK.GET_SDK().calculateTransferFee(testInsertPayment.merchantAddress, testInsertPayment.customerAddress, value);
        const executionFee = await MerchantSDK.GET_SDK().calculateMaxExecutionFee();

        const calculation = (testInsertPayment.numberOfPayments * (transferFee + executionFee)) * 1.5;
        expect(result).to.be.equal(calculation);
    });

});