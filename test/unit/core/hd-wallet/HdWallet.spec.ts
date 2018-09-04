import * as chai from 'chai';
import { HdWallet } from "../../../../src/core/hd-wallet/HdWallet";

chai.use(require('chai-match'));

const expect = chai.expect;

const MNEMONIC: string = 'autumn wheat wheat hazard aware laundry job amused cannon depart december steak';
const HD_WALLET = new HdWallet(MNEMONIC);

describe('A HDWallet', () => { 
    it('should return the owner - wallet at index 0', async () => {
        let walletAddress = await HD_WALLET.getAddressAtIndex(0);
        expect(walletAddress.length).to.be.equal(42)
        expect(walletAddress.substring(0, 2)).to.be.equal('0x');
        expect(walletAddress).to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    it('should return an executor - wallet at index 1', async () => {
        let walletAddress = await HD_WALLET.getAddressAtIndex(1);
        
        expect(walletAddress.length).to.be.equal(42);
        expect(walletAddress.substring(0, 2)).to.be.equal('0x');
        expect(walletAddress).to.match(/^0x[a-fA-F0-9]{40}$/);
    });
});