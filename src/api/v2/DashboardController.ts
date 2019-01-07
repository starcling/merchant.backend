import { JsonController, Get, Post, Res, Body } from 'routing-controllers';
import { DashboardDbConnector } from '../../connectors/dbConnector/DashboardDbConnector';
import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { DashboardApi } from '../../core/dashboard/DashboardApi';

@JsonController('/Dashboard')
export class DashboardController {

    /**
     * @api {get} /api/v2/Dashboard/transact
     * @apiDescription Retrieve the merchant address
     *
     * @apiName merchantAddress
     * @apiGroup DashboardController
     * @apiVersion  1.0.0
     *
     * @apiSuccess (200) {object} All Payments Details
     *
     */
    @Get('/transact')
    public async merchantAddress(@Res() response: any): Promise<any> {
        try {
            const queryResult = await new DashboardDbConnector().getMerchantAddress();
            return new APIResponseHandler().handle(response, queryResult);
        } catch (err) {
            return new APIResponseHandler().handle(response, err);
        }
    }

    /**
     * @api {get} /api/v2/Dashboard/address
     * @apiDescription Retrieve the bank address
     *
     * @apiName mkeyAddress
     * @apiGroup DashboardController
     * @apiVersion  1.0.0
     *
     * @apiSuccess (200) {object} All Payments Details
     *
     */
    @Get('/address')
    public async mkeyAddress(@Res() response: any): Promise<any> {
        try {
            const result = await new DashboardApi().getMerchantAddress();
            return new APIResponseHandler().handle(response, result);
        } catch (err) {
            return new APIResponseHandler().handle(response, err);
        }
    }

    /**
     * @api {get} /api/v2/Dashboard/etherBalance
     * @apiDescription Retrieve the balance for bank address
     *
     * @apiName balance
     * @apiGroup DashboardController
     * @apiVersion  1.0.0
     *
     * @apiSuccess (200) {object} All Payments Details
     *
     */
    @Get('/ether-balance')
    public async balance(@Res() response: any): Promise<any> {
        try {
            const result = await new DashboardApi().balance();
            return new APIResponseHandler().handle(response, result);
        } catch (err) {
            return new APIResponseHandler().handle(response, err);
        }
    }
    /**
      * @api {get} /api/v2/Dashboard/pmabalance
      * @apiDescription Retrieve a treasury balance
      *
      * @apiName pmaBalance
      * @apiGroup DashboardController
      * @apiVersion  1.0.0
      *
      * @apiSuccess (200) {object} All Payments Details
      *
      */
    @Get('/pmabalance')
    public async pmaBalance(@Res() response: any): Promise<any> {
        try {
            const result = await new DashboardApi().pmaBalance();
            return new APIResponseHandler().handle(response, result);
        } catch (err) {
            return new APIResponseHandler().handle(response, err);
        }
    }
    /**
      * @api {get} /api/v2/Dashboard/gas
      * @apiDescription Retrieve a gas value in ether
      *
      * @apiName getGas
      * @apiGroup DashboardController
      * @apiVersion  1.0.0
      *
      * @apiSuccess (200) {object} All Payments Details
      *
      */
    @Get('/gas')
    public async getGas(@Res() response: any): Promise<any> {
        try {
            const result = await new DashboardApi().getGas();
            return new APIResponseHandler().handle(response, result);
        } catch (err) {
            return new APIResponseHandler().handle(response, err);
        }
    }

    /**
      * @api {get} /api/v2/Dashboard/hash
      * @apiDescription Retrieve transaction history using Hash & BlockNumber
      *
      * @apiName testhash
      * @apiGroup DashboardController
      * @apiVersion  1.0.0
      *
      * @apiSuccess (200) {object} All Payments Details
      *
      */
    @Get('/hash')
    public async getTransact(@Res() response: any): Promise<any> {
        try {
            const result = await new DashboardApi().getTransact();
            return new APIResponseHandler().handle(response, result);
        } catch (err) {
            return new APIResponseHandler().handle(response, err);
        }
    }

    /**
      * @api {get} /api/v2/Dashboard/USDvalue
      * @apiDescription Retrieve ether value in USD & EUR
      *
      * @apiName getUsdBalance
      * @apiGroup DashboardController
      * @apiVersion  1.0.0
      *
      * @apiSuccess (200) {object} All Payments Details
      *
      */
    @Get('/usd-value')
    public async getUsdBalance(@Res() response: any): Promise<any> {
        try {
            const result = await new DashboardApi().getUsdBalance();
            return new APIResponseHandler().handle(response, result);
        } catch (err) {
            return new APIResponseHandler().handle(response, err);
        }
    }


    @Get('/ETH-value')
public async getUsdBalanceeth(@Body() request: any, @Res() response: any): Promise<any> {
try {
const result = await new DashboardApi().getUsdBalanceeth();
return new APIResponseHandler().handle(response, result);
} catch (err) {
return new APIResponseHandler().handle(response, err);
}
}
    /**
     * @api {get} /api/v2/Dashboard/pullPaymentGas
     * @apiDescription Retrieve ether value in USD & EUR
     *
     * @apiName getUsdBalance
     * @apiGroup DashboardController
     * @apiVersion  1.0.0
     *
     * @apiSuccess (200) {object} All Payments Details
     *
     */
    @Get('/pull-payment-gas')
    public async getPullPaymentGas(@Res() response: any): Promise<any> {
        try {
            const result = await new DashboardApi().getPullPaymentGas();
            return new APIResponseHandler().handle(response, result);
        } catch (err) {
            return new APIResponseHandler().handle(response, err);
        }
    }
    /**
     * @api {get} /api/v2/Dashboard/transferGas
     * @apiDescription Retrieve a gas value for tranfer from pullpayment account to treasury
     *
     * @apiName getTransferGas
     * @apiGroup DashboardController
     * @apiVersion  1.0.0
     *
     * @apiSuccess (200) {object} All Payments Details
     *
     */

    @Get('/transfer-gas')
    public async getTransferGas(@Res() response: any): Promise<any> {
        try {
            const result = await new DashboardApi().getTransferGas();
            return new APIResponseHandler().handle(response, result);
        } catch (err) {
            return new APIResponseHandler().handle(response, err);
        }
    }

    /**
     * @api {get} /api/v2/Dashboard/hashOverView
     * @apiDescription Retrieve transaction history for billing model overview
     *
     * @apiName testhashOverView
     * @apiGroup DashboardController
     * @apiVersion  1.0.0
     *
     * @apiSuccess (200) {object} All Payments Details
     *
     */
    @Post('/hash-overview')
    public async testhashOverView(@Body() request: any, @Res() response: any): Promise<any> {
        try {
            const result = await new DashboardApi().testhashOverView(request.billmodelId);
            return new APIResponseHandler().handle(response, result);
        } catch (err) {
            return new APIResponseHandler().handle(response, err);
        }
    }
}
