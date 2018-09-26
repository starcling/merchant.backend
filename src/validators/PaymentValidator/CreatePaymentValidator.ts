import * as Joi from 'joi';
import { IValidationError } from '../IValidationError';
import { PaymentValidator } from './PaymentValidator';

export class CreatePaymentValidator extends PaymentValidator {
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
    pullPaymentModelID: Joi.string().max(36).required(),
    numberOfPayments: Joi.number().min(1).required(),
    startTimestamp: Joi.number().min(0).required(),
    customerAddress: Joi.string().min(42).max(42).required(),
    pullPaymentAddress: Joi.string().min(42).max(42).required(),
    userID: Joi.string().max(36).allow(null)
});
