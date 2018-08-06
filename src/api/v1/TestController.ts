import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import {JsonController, Get, Res, Param} from 'routing-controllers';
import { MerchantSDK } from '../../core/MerchantSDK';
import { Globals } from '../../utils/globals';
// tslint:disable-next-line:variable-name
const Web3 = require('web3');

// // const API_URL = 'http://host.docker.internal/api/v1'; // When use docker
// const API_URL = 'http://core_server:8081/api/v1/'; // When do not use docker
@JsonController('/test')
export class TestController {
    @Get('/execute-pull-payment/:address/:paymentID')
    public async test(@Param('address') address: string, @Param('paymentID') paymentID: string, @Res() response: any): Promise<any> {
        try {

            const merchant = MerchantSDK.GET_SDK().build({
                web3: new Web3(new Web3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL())),
                merchantApiUrl: 'http://merchant_server:3000/api/v1'
            });
            const executionResult = await merchant.executePullPayment(address, paymentID);

            return new APIResponseHandler().handle(response, {status: 200, message: executionResult});
        } catch (err) {
            console.debug(err);
            return new APIResponseHandler().handle(response, {status: 400, error: err});
        }
    }
}
