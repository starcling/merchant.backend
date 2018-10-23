import * as Joi from 'joi';
import { IValidationError } from '../IValidationError';
import { PaymentValidator } from './PaymentValidator';
import { PaymentModelDbConnector } from '../../connectors/dbConnector/PaymentModelDbConnector';
import {Globals} from '../../utils/globals';

export class CreatePaymentValidator extends PaymentValidator {
    public async validate(data: any) {
        const options = {
            abortEarly: false,
            convert: true
        };

        const result = super.validate(data, dataSchema, options);

        if (result.error) {
            throw new IValidationError(result.error);
        }

        const dbRes = await new PaymentModelDbConnector().getPaymentModelByID(data.pullPaymentModelID);

        if (dbRes && dbRes.data && dbRes.data[0] && dbRes.data[0].id === null) {
            throw new IValidationError({
                details: [
                    {
                        message: '"pullPaymentModelID" must exist in the pull payment models table',
                        path: [
                            'pullPaymentModelID'
                        ],
                        type: 'string',
                        context: {
                            limit: 1,
                            value: 0,
                            key: 'pullPaymentModelID',
                            label: 'pullPaymentModelID'
                        }
                    }
                ]
            });
        }

        return result;
    }
}

const dataSchema = Joi.object().keys({
    pullPaymentModelID: Joi.string().regex(Globals.GET_UUID_REG_EXPRESSION()).min(36).max(36).required(),
    numberOfPayments: Joi.number().min(1).required(),
    startTimestamp: Joi.number().min(0).required(),
    customerAddress: Joi.string().regex(Globals.GET_LOWERCASE_ALPHANUMERIC_REG_EXPRESSION()).min(42).max(42).required(),
    pullPaymentAddress: Joi.string().regex(Globals.GET_ALPHANUMERIC_REG_EXPRESSION()).min(42).max(42).required(),
    userID: Joi.string().regex(Globals.GET_UUID_REG_EXPRESSION()).max(36).allow(null)
});
