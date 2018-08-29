import * as Joi from 'joi';
import { IValidationError } from '../IValidationError';
import { ContractValidator } from './ContractValidator';

export class CreateContractValidator extends ContractValidator {
    public validate(data: any) {
        const options = {
            abortEarly: false,
            convert: true
        };

        const result = super.validate(data, dataSchema, options);

        if (result.error) {
            throw new IValidationError(result.error);
        }
        return result;
    }
}

const dataSchema = Joi.object().keys({
    hdWalletIndex: Joi.number().required(),
    paymentID: Joi.string().required(),
    numberOfPayments: Joi.number().min(0).required(),
    nextPaymentDate: Joi.number().min(0).required(),
    lastPaymentDate: Joi.number().min(0).required(),
    startTimestamp: Joi.number().min(0).required(),
    customerAddress: Joi.string().required(),
    pullPaymentAddress: Joi.string().required(),
    statusID: Joi.number().required(),
    userID: Joi.string().required()
});
