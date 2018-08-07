import { JsonController, Res, Post, Body } from 'routing-controllers';
import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { StopSchedulerValidator } from '../../validators/SchedulerValidator/StopSchedulerValidator';
import { SchedulerConnector } from '../../connectors/api/v1/SchedulerConnector';

@JsonController('/scheduler')
export class SchedulerController {

    /**
    * @apiDefine Response
    * @apiSuccess {boolean} success The HTTP success of the call
    * @apiSuccess {number} status The HTTP status of the call
    * @apiSuccess {string} message A human-friendly summary of the result of the call
    * @apiSuccess {object} data The response data of the call
    */

    /**
    * @api {get} /api/v1/scheduler/stop/
    * @apiDescription Stops the scheduler with paymentID
    *
    * @apiName stopScheduler
    * @apiGroup SchedulerController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} paymentID - ID of the payment that you want to stop the scheduler for. SchedulerID and PaymentID are the same.
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "paymentID": "c90de9da-8b44-11e8-a3da-774835f29b05"
    * }
    *
    * @apiSuccess (200) {object} success
    *
      */
    @Post('/stop')
    public async stopScheduler(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            new StopSchedulerValidator().validate(request);
            const result = await new SchedulerConnector().stopScheduler(request.paymentID);

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
    * @apiDefine Response
    * @apiSuccess {boolean} success The HTTP success of the call
    * @apiSuccess {number} status The HTTP status of the call
    * @apiSuccess {string} message A human-friendly summary of the result of the call
    * @apiSuccess {object} data The response data of the call
    */

    /**
    * @api {get} /api/v1/scheduler/restartScheduler/
    * @apiDescription Restarts the scheduler with paymentID
    *
    * @apiName restartScheduler
    * @apiGroup SchedulerController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} paymentID - ID of the payment that you want to restart the scheduler for. SchedulerID and PaymentID are the same.
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "paymentID": "c90de9da-8b44-11e8-a3da-774835f29b05"
    * }
    *
    * @apiSuccess (200) {object} success
    *
      */
    @Post('/restart')
    public async restartScheduler(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            new StopSchedulerValidator().validate(request);
            const result = await new SchedulerConnector().restartScheduler(request.paymentID);

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

}