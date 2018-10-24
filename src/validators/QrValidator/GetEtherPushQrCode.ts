import * as Joi from 'joi';
import { QrValidator } from './QrValidator';
import { IValidationError } from '../IValidationError';
import {Globals} from '../../utils/globals';

export class GetEtherPushQrCode extends QrValidator {
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
    address: Joi.string().regex(Globals.GET_LOWERCASE_ALPHANUMERIC_REG_EXPRESSION()).min(42).max(42).required(),
    value: Joi.string().regex(Globals.GET_ALPHANUMERIC_REG_EXPRESSION()).required(),
    gas: Joi.number().min(0).required()
});