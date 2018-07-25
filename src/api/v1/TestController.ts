import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { JsonController, Get, Res } from 'routing-controllers';
import { MerchantSDK } from '../../core/MerchantSDK';
import { Globals } from '../../utils/globals';
// tslint:disable-next-line:variable-name
const Web3 = require('web3');

// // const API_URL = 'http://host.docker.internal/api/v1'; // When use docker
// const API_URL = 'http://core_server:8081/api/v1/'; // When do not use docker
@JsonController('/test')
export class TestController {
    @Get('/')
    public async test(@Res() response: any): Promise<any> {
        try {

            const merchant = MerchantSDK.GET_SDK().build({
                web3: new Web3(new Web3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL())),
                merchantApiUrl: 'http://merchant_server:3000/api/v1'
            });

            // tslint:disable-next-line:max-line-length
            return new APIResponseHandler().handle(response, await merchant.executePullPayment('0x15f79A4247cD2e9898dD45485683a0B26855b646', '87466fd6-8f27-11e8-8be0-bfce605f6069'));
        } catch (err) {
            console.debug('getRequest error', err);

            return new APIResponseHandler().handle(response, {status: 400, error: 'Authentication Failed'});
        }
    }
}
