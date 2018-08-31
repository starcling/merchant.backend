import { PaymentConnector } from "../../../../src/connectors/api/v1/PaymentConnector";
import { ContractDbConnector } from "../../../../src/connectors/dbConnector/ContractDbConnector";
import { addTestMnemonic } from "../hd-wallet/mnemonicHelper";

export const addTestPayment = async (payment) => {
    process.env.KEY_DB_HOST = 'localhost';
    process.env.KEY_DB_PORT = '3305';
    process.env.KEY_DB_USER = 'db_service';
    process.env.KEY_DB_PASSWORD = 'db_pass';
    process.env.KEY_DB_DATABASE = 'keys';
    process.env.MNEMONIC_ID = 'mnemonic_phrase';
    await addTestMnemonic('mnemonic_phrase');
    
    const paymentConnector = new PaymentConnector();

    return paymentConnector.createPayment(payment);
}

export const addTestContract = async (contract) => {
    process.env.KEY_DB_HOST = 'localhost';
    process.env.KEY_DB_PORT = '3305';
    process.env.KEY_DB_USER = 'db_service';
    process.env.KEY_DB_PASSWORD = 'db_pass';
    process.env.KEY_DB_DATABASE = 'keys';
    process.env.MNEMONIC_ID = 'mnemonic_phrase';
    await addTestMnemonic('mnemonic_phrase');

    const contractConnector = new ContractDbConnector();

    return contractConnector.createContract(contract);
}

export const retrieveTestContract = async (id) => {
    process.env.KEY_DB_HOST = 'localhost';
    process.env.KEY_DB_PORT = '3305';
    process.env.KEY_DB_USER = 'db_service';
    process.env.KEY_DB_PASSWORD = 'db_pass';
    process.env.KEY_DB_DATABASE = 'keys';

    const contractConnector = new ContractDbConnector();

    return contractConnector.getContract(id);
}

export const updateTestContract = async (contract) => {
    process.env.KEY_DB_HOST = 'localhost';
    process.env.KEY_DB_PORT = '3305';
    process.env.KEY_DB_USER = 'db_service';
    process.env.KEY_DB_PASSWORD = 'db_pass';
    process.env.KEY_DB_DATABASE = 'keys';

    const contractConnector = new ContractDbConnector();

    return contractConnector.updateContract(contract);
}

export const removeTestPayment = async (id) => {
    process.env.KEY_DB_HOST = 'localhost';
    process.env.KEY_DB_PORT = '3305';
    process.env.KEY_DB_USER = 'db_service';
    process.env.KEY_DB_PASSWORD = 'db_pass';
    process.env.KEY_DB_DATABASE = 'keys';

    const paymentConnector = new PaymentConnector();

    return paymentConnector.deletePayment(id);
}