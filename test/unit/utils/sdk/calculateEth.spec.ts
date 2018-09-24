import * as chai from 'chai';
import { ContractDbConnector } from '../../../../src/connectors/dbConnector/ContractDbConnector';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { DataService, ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { IPaymentContractInsert, IPaymentContractUpdate } from '../../../../src/core/contract/models';
import { IPaymentInsertDetails } from '../../../../src/core/payment/models';
import { MerchantSDK } from '../../../../src/core/MerchantSDK';
import { Globals } from '../../../../src/utils/globals';
import { PrivateKeysDbConnector } from '../../../../src/connectors/dbConnector/PrivateKeysDbConnector';

const web3 = require('web3');

chai.use(require('chai-match'));

const expect = chai.expect;

const contractDbConnector = new ContractDbConnector();
const paymentDbConnector = new PaymentDbConnector();
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

describe('A SDK calculateEth', () => {

    before(() => {
        MerchantSDK.GET_SDK().build({
            web3: new web3(new web3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(3))),
            updatePayment: contractDbConnector.updateContract,
            getPayment: contractDbConnector.getContract,
            getPrivateKey: new PrivateKeysDbConnector().getPrivateKey
        });
    })

    after(() => {
        MerchantSDK.GET_SDK().disconnectRedis();
    });

    beforeEach(async () => {
        await insertTestPayment();
        testInsertContract.customerAddress = '0x9d11DDd84198B30E56E31Aa89227344Cdb645e34';
        testInsertContract.merchantAddress = '0x8AEcFd4a6657bdB8Ca125fBc682C97Da4ea78f8f';
        testInsertContract.pullPaymentAddress = '0x7990fc1d2527d00c22db4c2b72e3e74f80b97d9c';
        const result = await contractDbConnector.createContract(testInsertContract);
        testUpdateContract.id = result.data[0].id;
    });
    afterEach(async () => {
        await clearTestPayment();
    });

    it('should calculate transfer fee eth gas needed', async () => {
        const result = await MerchantSDK.GET_SDK().calculateTransferFee(testInsertContract.merchantAddress, testInsertContract.customerAddress, 220);
        expect(result).to.be.lessThan(100000).and.greaterThan(0);
    });

    it('should calculate max eth gas needed for execution (60s)', async () => {
        const result = await MerchantSDK.GET_SDK().calculateMaxExecutionFee();
        expect(result).to.be.greaterThan(0);
    }).timeout(60000);

    it('should calculate eth gas needed', async () => {
        const result = await MerchantSDK.GET_SDK().calculateWeiToFund(testUpdateContract.id, testInsertContract.customerAddress);

        const value = parseUnits(((Number(testInsertPayment.amount) / 100) / 0.0009).toString(), 14);
        const transferFee = await MerchantSDK.GET_SDK().calculateTransferFee(testInsertContract.merchantAddress, testInsertContract.customerAddress, value);
        const executionFee = await MerchantSDK.GET_SDK().calculateMaxExecutionFee();

        const calculation = (testInsertContract.numberOfPayments * (transferFee + executionFee)) * 1.5;
        expect(result).to.be.equal(calculation);
    });

});

const parseUnits = (value, decimals: number) => {
    if (typeof (value) !== 'string' || !value.match(/^-?[0-9.,]+$/)) {
        throw new Error('invalid value');
    }
    // Remove commas
    let _value = value.replace(/,/g, '');
    // Is it negative?
    const negative = (_value.substring(0, 1) === '-');
    if (negative) { _value = _value.substring(1); }
    if (_value === '.') { throw new Error('invalid value'); }
    // Split it into a whole and fractional part
    const comps = _value.split('.');
    if (comps.length > 2) { throw new Error('too many decimal points'); }
    let whole: any = comps[0], fraction: any = comps[1];
    if (!whole) { whole = '0'; }
    if (!fraction) { fraction = '0'; }
    // Prevent underflow
    if (fraction.length > decimals) {
        throw new Error('too many decimal places');
    }
    while (fraction.length < decimals) { fraction += '0'; }

    whole = web3.utils.toBN(whole);
    fraction = web3.utils.toBN(fraction);
    const tenPower = web3.utils.toBN('1' + Array(decimals + 1).join('0'));
    let res = (whole.mul(tenPower)).add(fraction);

    if (negative) { res = res.mul(web3.utils.toBN(-1)); }

    return res;
}