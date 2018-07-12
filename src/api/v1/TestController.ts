import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { JsonController, Get, Res } from '../../../node_modules/routing-controllers';

@JsonController('/test')
export class TestController {
    @Get('/')
    public async test(@Res() response: any): Promise<any> {
        const result = {
            status: 200,
            message: 'Testing...'
        };

        return new APIResponseHandler().handle(response, result);
    }
}