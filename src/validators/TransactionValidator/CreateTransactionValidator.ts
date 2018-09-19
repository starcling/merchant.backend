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
    hash: Joi.string().required(),
    paymentID: Joi.string().required(),
    typeID: Joi.number().required(),
    timestamp: Joi.number().min(0).required()
});
