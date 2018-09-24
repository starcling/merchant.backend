import { HTTPResponseHandler } from '../../utils/web/HTTPResponseHandler';
import { MerchantSDK } from '../MerchantSDK';
import { HTTPResponseCodes } from '../../utils/web/HTTPResponseCodes';

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
     * @param {string} contractID id of the scheduler, same as contract id
     * @returns {HTTPResponse} Returns success feedback
     */
    public startScheduler(contractID: string, callback?: any) {
        try {
            new (MerchantSDK.GET_SDK().Scheduler)(contractID, callback ? callback : async () => {
                const contract = (await MerchantSDK.GET_SDK().getPayment(contractID)).data[0];

                contract.numberOfPayments = contract.numberOfPayments - 1;
                contract.lastPaymentDate = Math.floor(new Date().getTime() / 1000);
                contract.nextPaymentDate = contract.numberOfPayments === 0 ?
                contract.nextPaymentDate : Number(contract.nextPaymentDate) + contract.frequency;
                await MerchantSDK.GET_SDK().updatePayment(contract);
            }).start();

            return new HTTPResponseHandler().handleSuccess('Successfuly created scheduler.', contractID);
        } catch (error) {
            return new HTTPResponseHandler().handleFailed('Failed to restart scheduler.', error);
        }

    }
}