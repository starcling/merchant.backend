import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { JsonController, Get, Res } from '../../../node_modules/routing-controllers';
import puma_sdk_core from 'puma_sdk_core';
const API_URL = 'http://localhost:8081/api/v1';

@JsonController('/test')
export class TestController {
    @Get('/')
    public async test(@Res() response: any): Promise<any> {
        try {
            const merchant = new puma_sdk_core({ apiUrl: API_URL });
            const loginToken = await merchant.authenticate('user', 'password');
            const globalResult = await merchant.getRequest('/exchange/global');

            return new APIResponseHandler().handle(response, globalResult);
        } catch (err) {
            console.debug('getRequest error', err);

            return new APIResponseHandler().handle(response, {status: 400, error: 'Authentication Failed'});
        }
    }
}
