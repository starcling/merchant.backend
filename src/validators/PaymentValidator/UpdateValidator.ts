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
        //Do some other types of validations here

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
    startts: Joi.number().min(0).max(Joi.ref('endts')).required(),
    endts: Joi.number().min(Joi.ref('startts')).required(),
    type: Joi.number().required(),
    frequency: Joi.number().required(),
    transactionHash: Joi.string().required(),
    debitAccount: Joi.string().required()
});