import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { MerchantSDK } from '../MerchantSDK';
import { Globals } from '../../utils/globals';
import { HTTPResponseCodes } from '../../utils/web/HTTPResponseCodes';

export class Scheduler {

    public constructor() {
        MerchantSDK.GET_SDK().build(Globals.GET_DEFAULT_SDK_BUILD());
    }

    /**
     * @description Get method for getting payment from DB
     * @param {string} paymentID paymentID of the object
     * @returns {HTTPResponse} Returns success feedback
     */
    public stopScheduler(paymentID: string) {
        try {
            const result = MerchantSDK.GET_SDK().Scheduler.stop(paymentID);

            return new HTTPResponseHandler().handleSuccess('Successfully stopped scheduler.', result);
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('No scheduler with provided ID found.', error, HTTPResponseCodes.BAD_REQUEST());
        }
    }
}