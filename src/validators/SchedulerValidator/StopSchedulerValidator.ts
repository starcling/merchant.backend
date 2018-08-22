import * as Joi from 'joi';
import { IValidationError } from '../IValidationError';
import { SchedulerValidator } from './SchedulerValidator';

export class StopSchedulerValidator extends SchedulerValidator {
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
    paymentID: Joi.string().required()
});