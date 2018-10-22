import * as Joi from 'joi';
import { PaymentModelValidator } from './PaymentModelValidator';
import { IValidationError } from '../IValidationError';
import {Globals} from '../../utils/globals';

export class PatchPaymentModelValidator extends PaymentModelValidator {
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
    title: Joi.string().max(50).allow(null),
    description: Joi.string().max(140).allow(null),
    amount: Joi.number().min(1).allow(null),
    initialPaymentAmount: Joi.number().min(0).allow(null)
        .when('typeID', { is: 1, then: Joi.number().equal(0) })
        .when('typeID', { is: 2, then: Joi.number().equal(0) })
        .when('typeID', { is: 3, then: Joi.number().equal(0) })
        .when('typeID', { is: 4, then: Joi.number().min(1) })
        .when('typeID', { is: 5, then: Joi.number().equal(0) })
        .when('typeID', { is: 6, then: Joi.number().min(1) }),
    numberOfPayments: Joi.number().min(1).allow(null)
        .when('typeID', { is: 1, then: Joi.number().equal(1) })
        .when('typeID', { is: 2, then: Joi.number().equal(1) })
        .when('typeID', { is: 3, then: Joi.number().min(2) })
        .when('typeID', { is: 4, then: Joi.number().min(2) })
        .when('typeID', { is: 5, then: Joi.number().min(2) })
        .when('typeID', { is: 6, then: Joi.number().min(2) }),
    trialPeriod: Joi.number().min(0).allow(null)
        .when('typeID', { is: 1, then: Joi.number().equal(0) })
        .when('typeID', { is: 2, then: Joi.number().equal(0) })
        .when('typeID', { is: 3, then: Joi.number().equal(0) })
        .when('typeID', { is: 4, then: Joi.number().equal(0) })
        .when('typeID', { is: 5, then: Joi.number().min(1) })
        .when('typeID', { is: 6, then: Joi.number().min(1) }),
    currency: Joi.string().regex(Globals.GET_UPPERCASE_ALPABETIC_REG_EXPRESSION()).
        valid(Globals.GET_CURRENCIES()).min(3).max(3).allow(null),
    typeID: Joi.number().allow(null),
    frequency: Joi.number().min(1).allow(null),
    networkID: Joi.number().allow(null),
    automatedCashOut: Joi.boolean().required(),
    cashOutFrequency: Joi.number()
        .when('automatedCashOut', { is: true, then: Joi.number().min(1).required() })
        .when('automatedCashOut', { is: false, then: Joi.number().min(0).max(0).required() })
});