import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { MerchantSDK } from '../MerchantSDK';
import { Globals } from '../../utils/globals';
import { HTTPResponseCodes } from '../../utils/web/HTTPResponseCodes';
import { IPaymentUpdateDetails } from '../payment/models';

export class Scheduler {

    public constructor() {
        MerchantSDK.GET_SDK().build(Globals.GET_DEFAULT_SDK_BUILD());
    }

    /**
     * @description Method for stopping the scheduler
     * @param {string} paymentID id of the scheduler, same as payment id
     * @returns {HTTPResponse} Returns success feedback
     */
    public stopScheduler(paymentID: string) {
        try {
            const result = MerchantSDK.GET_SDK().Scheduler.stop(paymentID);

            if (result) {
                const message = 'Successfully stopped scheduler.';

                return new HTTPResponseHandler().handleSuccess(message, {});
            } else {
                const message = 'No scheduler with provided ID found.';

                return new HTTPResponseHandler().handleFailed(message, {}, HTTPResponseCodes.BAD_REQUEST());
            }
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed to stop scheduler.', error);
        }
    }

    /**
     * @description Method for restarting the scheduler
     * @param {string} paymentID id of the scheduler, same as payment id
     * @returns {HTTPResponse} Returns success feedback
     */
    public restartScheduler(paymentID: string) {
        try {
            const result = MerchantSDK.GET_SDK().Scheduler.restart(paymentID);

            if (result) {
                const message = 'Successfully restarted scheduler.';

                return new HTTPResponseHandler().handleSuccess(message, {});
            } else {
                const message = 'Scheduler with provided ID is either already running or doesn\'t exist.';

                return new HTTPResponseHandler().handleFailed(message, {}, HTTPResponseCodes.BAD_REQUEST());
            }
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed to restart scheduler.', error);
        }
    }

    /**
     * @description Method for starting the scheduler
     * @param {string} paymentID id of the scheduler, same as payment id
     * @returns {HTTPResponse} Returns success feedback
     */
    public startScheduler(payment: IPaymentUpdateDetails, callback?: any) {
        try {
            console.log(payment.id);
            new (MerchantSDK.GET_SDK().Scheduler)(payment, callback ? callback : async () => {
                payment.numberOfPayments = payment.numberOfPayments - 1;
                payment.lastPaymentDate = payment.nextPaymentDate;
                payment.nextPaymentDate = Number(payment.nextPaymentDate) + payment.frequency;
                console.debug(payment.numberOfPayments);
                await MerchantSDK.GET_SDK().updatePayment(payment);
            }).start();

            return new HTTPResponseHandler().handleSuccess('Successfuly created scheduler.', payment.id);
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed to restart scheduler.', error);
        }

    }
}