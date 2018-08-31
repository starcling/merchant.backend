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
    paymentID: Joi.string().required(),
    numberOfPayments: Joi.number().min(0).required(),
    startTimestamp: Joi.number().min(0).required(),
    customerAddress: Joi.string().required(),
    pullPaymentAddress: Joi.string().required()
});
