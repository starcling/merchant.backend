import { HTTPResponseCodes } from '../utils/web/HTTPResponseCodes';

export class IValidationError extends Error {
    public error: any;
    public status: number;
    public message: string;
    public success: boolean;

    constructor(_error: any) {
        super(_error);
        this.success = false;
        this.message = 'Bad Request.';
        this.status = HTTPResponseCodes.BAD_REQUEST();
        this.error = _error.details;
    }
}