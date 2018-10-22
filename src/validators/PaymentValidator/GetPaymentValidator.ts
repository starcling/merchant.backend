import * as Joi from 'joi';
import { IValidationError } from '../IValidationError';
import { PaymentValidator } from './PaymentValidator';
import {Globals} from '../../utils/globals';

export class GetPaymentValidator extends PaymentValidator {
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
    paymentID: Joi.string().regex(Globals.GET_UUID_REG_EXPRESSION()).max(36).required()
});
