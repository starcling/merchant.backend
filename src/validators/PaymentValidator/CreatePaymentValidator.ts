import * as Joi from 'joi';
import { PaymentValidator } from './PaymentValidator';
import { IValidationError } from '../IValidationError';

export class CreatePaymentValidator extends PaymentValidator {
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
    title: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.number().required(),
    amount: Joi.number().min(0).required(),
    currency: Joi.string().required(),
    startts: Joi.number().min(0).max(Joi.ref('endts')).required(),
    endts: Joi.number().min(Joi.ref('startts')).required(),
    type: Joi.number().required(),
    frequency: Joi.number().required()
});
