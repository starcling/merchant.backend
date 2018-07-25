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
    status: Joi.number().allow(null),
    customerAddress: Joi.string().allow(null),
    amount: Joi.number().min(0).allow(null),
    currency: Joi.string().allow(null),
    startTimestamp: Joi.number().min(0).max(Joi.ref('endTimestamp')).allow(null),
    endTimestamp: Joi.number().min(Joi.ref('startTimestamp')).allow(null),
    type: Joi.number().allow(null),
    frequency: Joi.number().allow(null),
    registerTxHash: Joi.string().allow(null),
    executeTxHash: Joi.string().allow(null),
    executeTxStatus: Joi.number().allow(null),
    debitAccount: Joi.string().allow(null),
    merchantAddress: Joi.string().allow(null)
});