import * as Joi from 'joi';
import { PaymentModelValidator } from './PaymentModelValidator';
import { IValidationError } from '../IValidationError';

export class CreatePaymentModelValidator extends PaymentModelValidator {
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
    merchantID: Joi.string().max(36).required(),
    title: Joi.string().max(50).required(),
    description: Joi.string().max(140).required(),
    amount: Joi.number().min(1).required(),
    initialPaymentAmount: Joi.number().min(0).required(),
    trialPeriod: Joi.number().min(0).required(),
    currency: Joi.string().min(3).max(3).required(),
    numberOfPayments: Joi.number().min(1).required(),
    typeID: Joi.number().required(),
    frequency: Joi.number().min(1).required(),
    networkID: Joi.number().integer().min(1).max(3).invalid(2).required(),
    automatedCashOut: Joi.boolean().required(),
    cashOutFrequency: Joi.number()
        .when('automatedCashOut', { is: true, then: Joi.number().min(1).required() })
        .when('automatedCashOut', { is: false, then: Joi.number().min(0).max(0).required() })
});
