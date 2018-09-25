import { PaymentModelConnector } from '../../../../src/connectors/api/v1/PaymentModelConnector';
import { PaymentDbConnector } from '../../../../src/connectors/dbConnector/PaymentDbConnector';
import { addTestMnemonic } from '../hd-wallet/mnemonicHelper';

export const addTestPaymentModel = async (paymentModel) => {
    process.env.KEY_DB_HOST = 'localhost';
    process.env.KEY_DB_PORT = '3305';
    process.env.KEY_DB_USER = 'db_service';
    process.env.KEY_DB_PASSWORD = 'db_pass';
    process.env.KEY_DB_DATABASE = 'keys';
    process.env.MNEMONIC_ID = 'test_mnemonic_phrase';
    await addTestMnemonic('mnemonic_phrase');

    const paymentModelConnector = new PaymentModelConnector();

    return paymentModelConnector.createPaymentModel(paymentModel);
};

export const addTestPayment = async (contract) => {
    process.env.KEY_DB_HOST = 'localhost';
    process.env.KEY_DB_PORT = '3305';
    process.env.KEY_DB_USER = 'db_service';
    process.env.KEY_DB_PASSWORD = 'db_pass';
    process.env.KEY_DB_DATABASE = 'keys';
    process.env.MNEMONIC_ID = 'test_mnemonic_phrase';
    await addTestMnemonic('test_mnemonic_phrase');

    const paymentDbConnector = new PaymentDbConnector();

    return paymentDbConnector.createPayment(contract);
};

export const retrieveTestPayment = async (id) => {
    process.env.KEY_DB_HOST = 'localhost';
    process.env.KEY_DB_PORT = '3305';
    process.env.KEY_DB_USER = 'db_service';
    process.env.KEY_DB_PASSWORD = 'db_pass';
    process.env.KEY_DB_DATABASE = 'keys';

    const paymentDbConnector = new PaymentDbConnector();

    return paymentDbConnector.getPaymentByID(id);
};

export const updateTestPayment = async (contract) => {
    process.env.KEY_DB_HOST = 'localhost';
    process.env.KEY_DB_PORT = '3305';
    process.env.KEY_DB_USER = 'db_service';
    process.env.KEY_DB_PASSWORD = 'db_pass';
    process.env.KEY_DB_DATABASE = 'keys';

    const paymentDbConnector = new PaymentDbConnector();

    return paymentDbConnector.updatePayment(contract);
};

export const removeTestPaymentModel = async (id) => {
    process.env.KEY_DB_HOST = 'localhost';
    process.env.KEY_DB_PORT = '3305';
    process.env.KEY_DB_USER = 'db_service';
    process.env.KEY_DB_PASSWORD = 'db_pass';
    process.env.KEY_DB_DATABASE = 'keys';

    const paymentModelConnector = new PaymentModelConnector();

    return paymentModelConnector.deletePaymentModel(id);
};