import * as Joi from 'joi';
import { IValidationError } from '../IValidationError';
import { TransactionValidator } from './TransactionValidator';
import {Globals} from '../../utils/globals';

export class GetTransactionValidator extends TransactionValidator {
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
    transactionHash: Joi.string().regex(Globals.GET_UUID_REG_EXPRESSION()).allow(null),
    pullPaymentID: Joi.string().regex(Globals.GET_UUID_REG_EXPRESSION()).allow(null),
    statusID: Joi.number().allow(null),
    typeID: Joi.number().allow(null)
});
