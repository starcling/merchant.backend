import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { JsonController, Get, Res, Param, Post, Body } from 'routing-controllers';
import { MerchantSDK } from '../../core/MerchantSDK';
import { Globals } from '../../utils/globals';
import { SchedulerConnector } from '../../connectors/api/v1/SchedulerConnector';
import { AwsEncryptionService } from '../../utils/AwsHelper/AwsEncryptionService';

@JsonController('/test')
export class TestController {
    /**
    * @api {get} /api/v2/execute-pull-paymentModel/:pullPaymentModelID
    * @apiDescription Test the execution of pull payment  with pullPaymentModelID
    *
    * @apiName test
    * @apiGroup TestController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} pullPaymentModelID - ID of the paymentModel
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "pullPaymentModelID": "c90de9da-8b44-11e8-a3da-774835f29b05"
    * }
    *
    * @apiSuccess (200) {object} success
    *
    */
    @Get('/execute-pull-paymentModel/:pullPaymentModelID')
    public async test(@Param('paymentID') paymentID: string, @Res() response: any): Promise<any> {
        try {
            const merchant = MerchantSDK.GET_SDK().build(Globals.GET_DEFAULT_SDK_BUILD(3));
            const executionResult = await merchant.executePullPayment(paymentID);

            return new APIResponseHandler().handle(response, { status: 200, message: executionResult });
        } catch (err) {

            return new APIResponseHandler().handle(response, { status: 400, error: err });
        }
    }

    /**
    * @api {get} /api/v2/start-scheduler/
    * @apiDescription Starts the scheduler with pullPaymentModelID
    *
    * @apiName startScheduler
    * @apiGroup TestController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} pullPaymentModelID - ID of the paymentModel that you want to start the scheduler for.
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "pullPaymentModelID": "c90de9da-8b44-11e8-a3da-774835f29b05"
    * }
    *
    * @apiSuccess (200) {object} success
    *
    */
    @Post('/start-scheduler')
    public async startScheduler(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            const result = await new SchedulerConnector().startScheduler(request.paymentID);

            return new APIResponseHandler().handle(response, result);
        } catch (err) {
            console.debug(err);

            return new APIResponseHandler().handle(response, { status: 400, error: err });
        }
    }
}
