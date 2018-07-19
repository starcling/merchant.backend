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
        //Do some other types of validations here

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
    status: Joi.number().allow(null),
    customerAddress: Joi.string().allow(null),
    amount: Joi.number().min(0).allow(null),
    currency: Joi.string().allow(null),
    startts: Joi.number().min(0).max(Joi.ref('endts')).allow(null),
    endts: Joi.number().min(Joi.ref('startts')).allow(null),
    type: Joi.number().allow(null),
    frequency: Joi.number().allow(null),
    transactionHash: Joi.string().allow(null),
    debitAccount: Joi.string().allow(null)
});