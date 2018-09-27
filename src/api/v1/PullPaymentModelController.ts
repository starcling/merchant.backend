import { JsonController, Res, Post, Body, Put, Patch, Param, Get, Delete } from 'routing-controllers';
import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { PaymentModelConnector } from '../../connectors/api/v1/PaymentModelConnector';
import { IPaymentModelInsertDetails, IPaymentModelUpdateDetails } from '../../core/paymentModel/models';
import { CreatePaymentModelValidator } from '../../validators/PaymentModelValidator/CreatePaymentModelValidator';
import { UpdatePaymentModelValidator } from '../../validators/PaymentModelValidator/UpdatePaymentModelValidator';
import { PatchPaymentModelValidator } from '../../validators/PaymentModelValidator/PatchPaymentModelValidator';
import { GetPaymentModelValidator } from '../../validators/PaymentModelValidator/GetPaymentModelValidator';
import { DeletePaymentModelValidator } from '../../validators/PaymentModelValidator/DeletePaymentModelValidator';

@JsonController('/pull-payment-models')
export class PullPaymentModelController {

    /**
    * @apiDefine Response
    * @apiSuccess {boolean} success The HTTP success of the call
    * @apiSuccess {number} status The HTTP status of the call
    * @apiSuccess {string} message A human-friendly summary of the result of the call
    * @apiSuccess {object} data The response data of the call
    *
    */

    /**
    * @api {post} /api/v1/pull-payment-models/
    * @apiDescription Create a new paymentModel model in DB
    *
    * @apiName createPaymentModel
    * @apiGroup PullPaymentModelController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} merchantID - The id of the merchant
    * @apiParam {string} title - Title of the pull payment model
    * @apiParam {string} description - Description of the pull payment model
    * @apiParam {number} amount - Amount of pull payment model
    * @apiParam {number} initialPaymentAmount - The initial pull payment model amount
    * @apiParam {number} trialPeriod - The trial period of the pull payment model
    * @apiParam {string} currency - Currency of pull payment pull payment
    * @apiParam {number} numberOfPayments - The amount of time you can execute a pull payment model
    * @apiParam {number} typeID - Type of pull payment model
    * @apiParam {number} frequency - The frequency of the pull payment model execution
    * @apiParam {number} networkID - ETH Network ID - 1 mainnet / 3 ropsten
    * @apiParam {boolean} automatedCashOut - True if cash out is autometed, false if not
    * @apiParam {number} cashOutFrequency - The cash out frequency
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "merchantID": "f3d0b32a-c229-11e8-9e05-dff013c3fd20",
    *   "title": "Gold Subscription",
    *   "description": "National Cryptographic Monthly Gold subscription",
    *    "amount": 10,
    *   "initialPaymentAmount": 5,
    *   "trialPeriod" : 10,
    *   "currency": "EUR",
    *   "numberOfPayments": 10,
    *   "typeID": 2,
    *   "frequency": 300,
    *   "networkID": 3,
    *   "automatedCashOut": true,
    *   "cashOutFrequency": 1
    * }
    *
    * @apiSuccess (200) {object} PullPaymentModel Details
    *
    */
    @Post('/')
    public async createPaymentModel(@Body() paymentModel: IPaymentModelInsertDetails, @Res() response: any): Promise<any> {
        try {
            new CreatePaymentModelValidator().validate(paymentModel);
            const result = await new PaymentModelConnector().createPaymentModel(paymentModel);

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
    * @api {get} /api/v1/pull-payment-models/
    * @apiDescription Retrieve an array of payment models
    *
    * @apiName getAllPaymentModels
    * @apiGroup PullPaymentModelController
    * @apiVersion  1.0.0
    *
    * @apiSuccess (200) {object} PaymentModel Details
    *
    */
   @Get('/')
   public async getAllPaymentModels(@Res() response: any): Promise<any> {
       try {
           const result = await new PaymentModelConnector().getAllPaymentModels();

           return new APIResponseHandler().handle(response, result);
       } catch (error) {
           return new APIResponseHandler().handle(response, error);
       }
   }

    /**
    * @api {get} /api/v1/pull-payment-models/:pullPaymentModelID
    * @apiDescription Retrieves a single payment model
    *
    * @apiName getPaymentModelByID
    * @apiGroup PullPaymentModelController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} pullPaymentModelID - ID of the paymentModel model
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "pullPaymentModelID": "24947f2e-9164-11e8-bc8e-27e75bf6baf4"
    * }
    *
    * @apiSuccess (200) {object} PaymentModel details for a specific id
    *
    */
    @Get('/:pullPaymentModelID')
    public async getPaymentModelByID(@Param('pullPaymentModelID') pullPaymentModelID: string, @Res() response: any): Promise<any> {
        try {
            new GetPaymentModelValidator().validate({ pullPaymentModelID });
            const result = await new PaymentModelConnector().getPaymentModelByID(pullPaymentModelID);

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
    * @api {put} /api/v1/pull-payment-models/:pullPaymentModelID
    * @apiDescription Update existing payment model in the DB
    *
    * @apiName updatePaymentModel
    * @apiGroup PullPaymentModelController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} pullPaymentModelID - PaymentModel ID
    * @apiParam {string} title - Title of the pull payment model
    * @apiParam {string} description - Description of the pull payment model
    * @apiParam {number} amount - Amount of pull payment model
    * @apiParam {number} initialPaymentAmount - The initial pull payment model amount
    * @apiParam {number} trialPeriod - The trial period of the pull payment model
    * @apiParam {string} currency - Currency of pull payment pull payment
    * @apiParam {number} numberOfPayments - The amount of time you can execute a pull payment model
    * @apiParam {number} typeID - Type of pull payment model
    * @apiParam {number} frequency - The frequency of the pull payment model execution
    * @apiParam {number} networkID - ETH Network ID - 1 mainnet / 3 ropsten
    * @apiParam {boolean} automatedCashOut - True if cash out is autometed, false if not
    * @apiParam {number} cashOutFrequency - The cash out frequency
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "title": "Gold Subscription",
    *   "description": "National Cryptographic Monthly Gold subscription",
    *    "amount": 10,
    *   "initialPaymentAmount": 5,
    *   "trialPeriod" : 10,
    *   "currency": "EUR",
    *   "numberOfPayments": 10,
    *   "typeID": 2,
    *   "frequency": 300,
    *   "networkID": 3,
    *   "automatedCashOut": true,
    *   "cashOutFrequency": 1
    * }
    *
    * @apiSuccess (200) {object} updated payment model details
    *
    */
    @Put('/:pullPaymentModelID')
    public async updatePaymentModel(@Param('pullPaymentModelID') pullPaymentModelID: string, @Body() payment: IPaymentModelUpdateDetails,
                        @Res() response: any): Promise<any> {
        try {
            payment.id = pullPaymentModelID;
            new UpdatePaymentModelValidator().validate(payment);
            const result = await new PaymentModelConnector().updatePaymentModel(payment);
            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
    * @api {patch} /api/v1/pull-payment-models/:pullPaymentModelID
    * @apiDescription Patch existing paymentModel model in DB
    *
    * @apiName patchPaymentModel
    * @apiGroup PullPaymentModelController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} pullPaymentModelID - PaymentModel ID
    * @apiParam {string} title - Title of the pull payment model
    * @apiParam {string} description - Description of the pull payment model
    * @apiParam {number} amount - Amount of pull payment model
    * @apiParam {number} initialPaymentAmount - The initial pull payment model amount
    * @apiParam {number} trialPeriod - The trial period of the pull payment model
    * @apiParam {string} currency - Currency of pull payment pull payment
    * @apiParam {number} numberOfPayments - The amount of time you can execute a pull payment model
    * @apiParam {number} typeID - Type of pull payment model
    * @apiParam {number} frequency - The frequency of the pull payment model execution
    * @apiParam {number} networkID - ETH Network ID - 1 mainnet / 3 ropsten
    * @apiParam {boolean} automatedCashOut - True if cash out is autometed, false if not
    * @apiParam {number} cashOutFrequency - The cash out frequency
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "title": "Gold Subscription",
    *   "description": "National Cryptographic Monthly Gold subscription",
    *    "amount": 10,
    *   "initialPaymentAmount": 5,
    *   "trialPeriod" : 10,
    *   "currency": "EUR",
    *   "numberOfPayments": 10,
    *   "typeID": 2,
    *   "frequency": 300,
    *   "networkID": 3,
    *   "automatedCashOut": true,
    *   "cashOutFrequency": 1
    * }
    *
    * @apiSuccess (200) {object} PaymentModel Details
    *
    */
    @Patch('/:pullPaymentModelID')
    public async patchPaymentModel(@Param('pullPaymentModelID') pullPaymentModelID: string,
                                   @Body() paymentModel: IPaymentModelUpdateDetails,
                                   @Res() response: any): Promise<any> {
        try {
            paymentModel.id = pullPaymentModelID;
            new PatchPaymentModelValidator().validate(paymentModel);
            const result = await new PaymentModelConnector().updatePaymentModel(paymentModel);
            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
    * @api {delete} /api/v1/pull-payment-models/:pullPaymentModelID
    * @apiDescription Delete a single paymentModel
    *
    * @apiName deletePaymentModel
    * @apiGroup PullPaymentModelController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} pullPaymentModelID - ID of the paymentModel
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "pullPaymentModelID": "5bf2c85e-c238-11e8-a4af-63e315e13612"
    * }
    *
    * @apiSuccess (200) {object} no data
    *
    */
   @Delete('/:pullPaymentModelID')
   public async deletePaymentModel(@Param('pullPaymentModelID') pullPaymentModelID: string, @Res() response: any): Promise<any> {
       try {
           new DeletePaymentModelValidator().validate({ pullPaymentModelID });
           const result = await new PaymentModelConnector().deletePaymentModel(pullPaymentModelID);

           return new APIResponseHandler().handle(response, result);
       } catch (error) {
           return new APIResponseHandler().handle(response, error);
       }
   }
}