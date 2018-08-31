import * as Joi from 'joi';
import { PaymentValidator } from './PaymentValidator';
import { IValidationError } from '../IValidationError';

export class UpdateValidator extends PaymentValidator {
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
    title: Joi.string().required(),
    description: Joi.string().required(),
    promo: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    initialPaymentAmount: Joi.number().min(0).required(),
    trialPeriod: Joi.number().min(0).required(),
    currency: Joi.string().required(),
    numberOfPayments: Joi.number().required(),
    typeID: Joi.number().required(),
    frequency: Joi.number().required(),
    networkID: Joi.number().integer().min(1).max(3).invalid(2).required()
});