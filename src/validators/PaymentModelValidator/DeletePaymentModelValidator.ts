import * as Joi from 'joi';
import { PaymentModelValidator } from './PaymentModelValidator';
import { IValidationError } from '../IValidationError';

export class DeletePaymentModelValidator extends PaymentModelValidator {
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
    pullPaymentModelID: Joi.string().required()
});
