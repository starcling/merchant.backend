import { IValidator } from '../IValidator';
import * as Joi from 'joi';

export class SchedulerValidator implements IValidator {
    public validate(object: any, schema: any, options?: any) {
        return Joi.validate(object, schema, options);
    }
}