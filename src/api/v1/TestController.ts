import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { JsonController, Get, Res, Param, Post, Body } from 'routing-controllers';
import { MerchantSDK } from '../../core/MerchantSDK';
import { Globals } from '../../utils/globals';
import { SchedulerConnector } from '../../connectors/api/v1/SchedulerConnector';

@JsonController('/test')
export class TestController {
    @Get('/execute-pull-payment/:paymentID')
    public async test(@Param('paymentID') paymentID: string, @Res() response: any): Promise<any> {
        try {
            const merchant = MerchantSDK.GET_SDK().build(Globals.GET_DEFAULT_SDK_BUILD(3));
            const executionResult = await merchant.executePullPayment(paymentID);

            return new APIResponseHandler().handle(response, { status: 200, message: executionResult });
        } catch (err) {
            console.debug(err);

            return new APIResponseHandler().handle(response, { status: 400, error: err });
        }
    }
    @Post('/start-scheduler')
    public async startScheduler(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            const result = await new SchedulerConnector().startScheduler(request.paymentID);

            // tslint:disable-next-line:max-line-length
            return new APIResponseHandler().handle(response, result);
        } catch (err) {
            console.debug(err);

            return new APIResponseHandler().handle(response, { status: 400, error: err });
        }
    }
}
