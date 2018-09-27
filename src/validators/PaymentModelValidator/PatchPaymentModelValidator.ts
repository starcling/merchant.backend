import * as Joi from 'joi';
import { PaymentModelValidator } from './PaymentModelValidator';
import { IValidationError } from '../IValidationError';

export class PatchPaymentModelValidator extends PaymentModelValidator {
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
    id: Joi.string().max(36).required(),
    title: Joi.string().max(50).allow(null),
    description: Joi.string().max(140).allow(null),
    amount: Joi.number().min(1).allow(null),
    initialPaymentAmount: Joi.number().min(0).allow(null),
    trialPeriod: Joi.number().min(0).allow(null),
    currency: Joi.string().min(3).max(3).allow(null),
    numberOfPayments: Joi.number().min(1).allow(null),
    typeID: Joi.number().allow(null),
    frequency: Joi.number().min(1).allow(null),
    networkID: Joi.number().allow(null),
    automatedCashOut: Joi.boolean().required(),
    cashOutFrequency: Joi.number()
        .when('automatedCashOut', { is: true, then: Joi.number().min(1).required() })
        .when('automatedCashOut', { is: false, then: Joi.number().min(0).max(0).required() })
});