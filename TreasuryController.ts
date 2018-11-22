import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { JsonController, Get, Res, Param, Post, Body } from 'routing-controllers';
import {PrivateKeysDbConnector} from '../../connectors/dbConnector/PrivateKeysDbConnector';

@JsonController('/address')
export class TreasuryController {

    @Get('/treasury')
    public async mkeyAddress(@Body() request: any, @Res() response: any): Promise<any> {
        try {
           const addvalue = '0x3ef78A06d3FBA9E9508df0F4f0865Ca9261F992F';
           const result = await new PrivateKeysDbConnector().getPrivateKey(addvalue);
           return new APIResponseHandler().handle(response, result);
        } catch (err) {
           return new APIResponseHandler().handle(response, { status: 400, error: err });
        }
    }

}