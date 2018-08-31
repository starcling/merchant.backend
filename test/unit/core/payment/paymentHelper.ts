import { DataServiceEncrypted } from "../../../../src/utils/datasource/DataServiceEncrypted";
import { ISqlQuery } from "../../../../src/utils/datasource/DataService";
import { IPaymentInsertDetails } from "../../../../src/core/payment/models";
import { PaymentConnector } from "../../../../src/connectors/api/v1/PaymentConnector";
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

export const retrieveTestPayment = async (id) => {
    process.env.KEY_DB_HOST = 'localhost';
    process.env.KEY_DB_PORT = '3305';
    process.env.KEY_DB_USER = 'db_service';
    process.env.KEY_DB_PASSWORD = 'db_pass';
    process.env.KEY_DB_DATABASE = 'keys';

    const paymentConnector = new PaymentConnector();

    return paymentConnector.getPayment(id);
}

export const updateTestPayment = async (payment) => {
    process.env.KEY_DB_HOST = 'localhost';
    process.env.KEY_DB_PORT = '3305';
    process.env.KEY_DB_USER = 'db_service';
    process.env.KEY_DB_PASSWORD = 'db_pass';
    process.env.KEY_DB_DATABASE = 'keys';

    const paymentConnector = new PaymentConnector();

    return paymentConnector.createPayment(payment);
}

export const removeTestPayment = async (id) => {
    process.env.KEY_DB_HOST = 'localhost';
    process.env.KEY_DB_PORT = '3305';
    process.env.KEY_DB_USER = 'db_service';
    process.env.KEY_DB_PASSWORD = 'db_pass';
    process.env.KEY_DB_DATABASE = 'keys';

    const paymentConnector = new PaymentConnector();

    return paymentConnector.createPayment(id);
}