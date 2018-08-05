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
    status: Joi.number().required(),
    customerAddress: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    currency: Joi.string().required(),
    limit: Joi.number().required(),
    startTimestamp: Joi.number().min(0).max(Joi.ref('endTimestamp')).required(),
    endTimestamp: Joi.number().min(Joi.ref('startTimestamp')).required(),
    nextPaymentDate: Joi.number().required(),
    lastPaymentDate: Joi.number().required(),
    type: Joi.number().required(),
    frequency: Joi.number().required(),
    registerTxHash: Joi.string().required(),
    registerTxStatus: Joi.number().required(),
    executeTxHash: Joi.string().required(),
    executeTxStatus: Joi.number().required(),
    pullPaymentAccountAddress: Joi.string().required(),
    merchantAddress: Joi.string().required(),
    userId: Joi.string().required()
});