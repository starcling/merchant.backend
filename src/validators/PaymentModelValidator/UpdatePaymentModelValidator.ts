import * as Joi from 'joi';
import { PaymentModelValidator } from './PaymentModelValidator';
import { IValidationError } from '../IValidationError';
import {Globals} from '../../utils/globals';

export class UpdatePaymentModelValidator extends PaymentModelValidator {
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
    id: Joi.string().regex(Globals.GET_UUID_REG_EXPRESSION()).max(36).required(),
    title: Joi.string().max(50).required(),
    description: Joi.string().max(140).required(),
    amount: Joi.number().min(0).required(),
    initialPaymentAmount: Joi.number().min(0).required()
        .when('typeID', { is: 1, then: Joi.number().equal(0) })
        .when('typeID', { is: 2, then: Joi.number().equal(0) })
        .when('typeID', { is: 3, then: Joi.number().equal(0) })
        .when('typeID', { is: 4, then: Joi.number().min(1) })
        .when('typeID', { is: 5, then: Joi.number().equal(0) })
        .when('typeID', { is: 6, then: Joi.number().min(1) }),
    numberOfPayments: Joi.number().min(1).required()
        .when('typeID', { is: 1, then: Joi.number().equal(1) })
        .when('typeID', { is: 2, then: Joi.number().equal(1) })
        .when('typeID', { is: 3, then: Joi.number().min(2) })
        .when('typeID', { is: 4, then: Joi.number().min(2) })
        .when('typeID', { is: 5, then: Joi.number().min(2) })
        .when('typeID', { is: 6, then: Joi.number().min(2) }),
    trialPeriod: Joi.number().min(0).required()
        .when('typeID', { is: 1, then: Joi.number().equal(0) })
        .when('typeID', { is: 2, then: Joi.number().equal(0) })
        .when('typeID', { is: 3, then: Joi.number().equal(0) })
        .when('typeID', { is: 4, then: Joi.number().equal(0) })
        .when('typeID', { is: 5, then: Joi.number().min(1) })
        .when('typeID', { is: 6, then: Joi.number().min(1) }),
    currency: Joi.string().regex(Globals.GET_UPPERCASE_ALPABETIC_REG_EXPRESSION()).
        valid(Globals.GET_CURRENCIES()).min(3).max(3).required(),
    typeID: Joi.number().required(),
    frequency: Joi.number().min(1).required(),
    networkID: Joi.number().min(1).max(3).invalid(2).required(),
    automatedCashOut: Joi.boolean().required(),
    cashOutFrequency: Joi.number()
        .when('automatedCashOut', { is: true, then: Joi.number().min(1).required() })
        .when('automatedCashOut', { is: false, then: Joi.number().min(0).max(0).required() })
});