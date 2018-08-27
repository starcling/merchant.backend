import * as Joi from 'joi';
import { PaymentValidator } from './PaymentValidator';
import { IValidationError } from '../IValidationError';

export class PatchValidator extends PaymentValidator {
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
    id: Joi.string().required(),
    title: Joi.string().allow(null),
    description: Joi.string().allow(null),
    promo: Joi.string().allow(null),
    amount: Joi.number().min(0).allow(null),
    initialPaymentAmount: Joi.number().min(0).allow(null),
    currency: Joi.string().allow(null),
    numberOfPayments: Joi.number().allow(null),
    typeID: Joi.number().allow(null),
    frequency: Joi.number().allow(null),
    networkID: Joi.string().allow(null)
});