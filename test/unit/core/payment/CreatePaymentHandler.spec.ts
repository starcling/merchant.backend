import * as chai from 'chai';
import { CreatePaymentHandler } from '../../../../src/core/payment/CreatePaymentHandler';

chai.use(require('chai-match'));

const expect = chai.expect;

process.env.KEY_DB_HOST = 'localhost';
process.env.KEY_DB_PORT = '3305';
process.env.KEY_DB_USER = 'db_service';
process.env.KEY_DB_PASSWORD = 'db_pass';
process.env.KEY_DB_DATABASE = 'keys';
const HD_WALLET = new CreatePaymentHandler();

describe('A HDWallet', () => { 
    it('should return the owner - wallet at index 0', async () => {
        let walletAddress = await HD_WALLET.handle();

        expect(walletAddress.index).to.exist.and.not.be.null;
        expect(walletAddress.address).to.exist.and.not.be.null;
    });
});