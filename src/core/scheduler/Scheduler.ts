import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { MerchantSDK } from '../MerchantSDK';
import { HTTPResponseCodes } from '../../utils/web/HTTPResponseCodes';
import { IPaymentUpdateDetails } from '../payment/models';

export class Scheduler {
    /**
     * @description Method for stopping the scheduler
     * @param {string} paymentID id of the scheduler, same as payment id
     * @returns {HTTPResponse} Returns success feedback
     */
    public async stopScheduler(paymentID: string) {
        try {
            const result = await MerchantSDK.GET_SDK().Scheduler.stop(paymentID);

            if (result) {
                const message = 'Successfully stopped scheduler.';

                return new HTTPResponseHandler().handleSuccess(message, result);
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
    public async restartScheduler(paymentID: string) {
        try {
            const result = await MerchantSDK.GET_SDK().Scheduler.restart(paymentID);

            if (result) {
                const message = 'Successfully restarted scheduler.';

                return new HTTPResponseHandler().handleSuccess(message, result);
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
            new (MerchantSDK.GET_SDK().Scheduler)(payment.id, callback ? callback : async () => {
                const pa = (await MerchantSDK.GET_SDK().getPayment(payment.id)).data[0];

                pa.numberOfPayments = pa.numberOfPayments - 1;
                pa.lastPaymentDate = Math.floor(new Date().getTime() / 1000);
                pa.nextPaymentDate = pa.numberOfPayments === 0 ?
                    pa.nextPaymentDate : Number(pa.nextPaymentDate) + pa.frequency;

                await MerchantSDK.GET_SDK().updatePayment(pa);
            }).start();

            return new HTTPResponseHandler().handleSuccess('Successfuly created scheduler.', payment.id);
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed to restart scheduler.', error);
        }

    }
}