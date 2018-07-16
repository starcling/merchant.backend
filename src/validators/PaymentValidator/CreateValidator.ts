import * as Joi from 'joi';
import { PaymentValidator } from './PaymentValidator';

export class CreateValidator extends PaymentValidator {
    public validate(data: any) {
        const options = {
            abortEarly: false,
            convert: true
        };

        const result = super.validate(data, dataSchema, options);
        //Do some other types of validations here

        if (result.error) {
            throw new Error(result.error);
        }
        return result;
    }
}

const dataSchema = Joi.object().keys({
    address: Joi.string().min(42).max(42).required(),
    networkID: Joi.number().integer().min(1).max(3).invalid(2),
    startblock: Joi.number().max(Joi.ref('endblock')),
    endblock: Joi.number().min(Joi.ref('startblock')),
    count: Joi.number()
});