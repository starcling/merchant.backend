import * as Joi from 'joi';
import { QrValidator } from './QrValidator';
import { IValidationError } from '../IValidationError';

export class GetQrValidator extends QrValidator {
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
    paymentID: Joi.string().max(36).required()
});
