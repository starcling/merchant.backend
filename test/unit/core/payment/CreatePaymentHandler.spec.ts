import * as chai from 'chai';
import { CreatePaymentModelHandler } from '../../../../src/core/paymentModel/CreatePaymentModelHandler';
import { ISqlQuery } from '../../../../src/utils/datasource/DataService';
import { DataServiceEncrypted } from '../../../../src/utils/datasource/DataServiceEncrypted';
import { DefaultConfig } from '../../../../src/config/default.config';

chai.use(require('chai-match'));

const expect = chai.expect;

process.env.KEY_DB_HOST = 'localhost';
process.env.KEY_DB_PORT = '3305';
process.env.KEY_DB_USER = 'db_service';
process.env.KEY_DB_PASSWORD = 'db_pass';
process.env.KEY_DB_DATABASE = 'keys';
process.env.MNEMONIC_ID = 'create_payment_handler_mnemonic'
process.env.NODE_ENV = 'development';

const dataservice = new DataServiceEncrypted();

const TEST_MNEMONIC = 'handler test test test test test test test test test test test test test test';

const insertEncryptedMnemonicData = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'call add_mnemonic(?, ?)',
        values: ['create_payment_handler_mnemonic', TEST_MNEMONIC]
    }
    await dataservice.executeQueryAsPromise(sqlQuery);
}

const deleteEncryptedMnemonicData = async () => {
    const sqlQuery: ISqlQuery = {
        text: 'delete from mnemonics where id = ?',
        values: ['create_payment_handler_mnemonic']
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
}

const paymentHandler = new CreatePaymentModelHandler();

describe('A Create PaymentModel Handler', () => {
    beforeEach(async () => {
        await insertEncryptedMnemonicData();
    });
    afterEach(async () => {
        await deleteEncryptedMnemonicData();
    });

    it('should handle the paymentModel before creation', async () => {
        let walletAddress = await paymentHandler.handle();

        expect(walletAddress.index).to.not.be.null;
        expect(walletAddress.address).to.not.be.null;
    });

    it('should return an empty wallet details when the mnemonic does not exists', async () => {
        process.env.MNEMONIC_ID = 'not_existing_menmonic'

        let walletAddress = await paymentHandler.handle();
        console.log(walletAddress);
        expect(walletAddress.index).to.be.null;
        expect(walletAddress.address).to.be.null;
    });
});