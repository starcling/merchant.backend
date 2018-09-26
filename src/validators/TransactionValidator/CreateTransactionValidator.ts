import * as Joi from 'joi';
import { IValidationError } from '../IValidationError';
import { TransactionValidator } from './TransactionValidator';

export class CreateTransactionValidator extends TransactionValidator {
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
    hash: Joi.string().min(66).max(66).required(),
    paymentID: Joi.string().max(36).required(),
    typeID: Joi.number().required(),
    timestamp: Joi.number().min(0).required()
});
