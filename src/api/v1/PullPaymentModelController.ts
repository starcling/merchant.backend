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
    * @api {post} /api/v1/payment-models/
    * @apiDescription Create a new paymentModel model in DB
    *
    * @apiName create
    * @apiGroup PullPaymentModelController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} title - Title of the pull payment model
    * @apiParam {string} description - Description of the pull payment model
    * @apiParam {number} amount - Amount of pull payment model
    * @apiParam {string} currency - Currency of pull payment pull payment
    * @apiParam {number} startTimestamp - Start timestamp of paymentModel model
    * @apiParam {number} endTimestamp - End timestamp of pull payment model
    * @apiParam {number} type - Type of pull payment model
    * @apiParam {string} merchantAddress - Ethereum wallet address of merchant
    * @apiParam {number} frequency - Frequency of execution
    * @apiParam {number} networkID - ETH Network ID - 1 mainnet / 3 ropsten
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "title": "string",
    *   "description": "string",
    *   "amount": 43,
    *   "currency": "string",
    *   "startTimestamp": 10,
    *   "endTimestamp": 13,
    *   "type": 1,
    *   "merchantAddress": "string",
    *   "frequency": 10,
    *   "networkID": 3
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
    * @api {get} /api/v1/paymentModel-models/
    * @apiDescription Retrieve an array of paymentModel-models
    *
    * @apiName getAllPaymentsModels
    * @apiGroup PullPaymentModelController
    * @apiVersion  1.0.0
    *
    * @apiSuccess (200) {object} PaymentModel Model Details
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
    * @api {get} /api/v1/paymentModel-models/:pullPaymentModelID
    * @apiDescription Retrieves a single paymentModel
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
    * @api {put} /api/v1/paymentModel-models/:pullPaymentModelID
    * @apiDescription Update existing paymentModel model in DB
    *
    * @apiName update
    * @apiGroup PullPaymentModelController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} pullPaymentModelID - PaymentModel ID
    * @apiParam {string} title - Title of the paymentModel model
    * @apiParam {string} description - Description of the paymentModel model
    * @apiParam {string} promo - Promo code for the paymentModel model
    * @apiParam {number} status - Status of paymentModel model
    * @apiParam {string} customerAddress - Customer address of the paymentModel model
    * @apiParam {number} amount - Amount of paymentModel model
    * @apiParam {string} currency - Currency of paymentModel model
    * @apiParam {number} startTimestamp - Start timestamp of paymentModel model
    * @apiParam {number} endTimestamp - End timestamp of paymentModel model
    * @apiParam {number} type - Type of paymentModel model
    * @apiParam {number} frequency - Frequency of execution model
    * @apiParam {string} registerTxHash - Transaction hash for register pull paymentModel
    * @apiParam {string} executeTxHash - Transaction hash for execute pull paymentModel
    * @apiParam {number} executeTxStatus - Transaction hash status for execute pull paymentModel
    * @apiParam {string} pullPaymentAddress - Debit account for paymentModel
    * @apiParam {string} merchantAddress - Debit account for paymentModel
    * @apiParam {number} networkID - ETH Network ID - 1 mainnet / 3 ropsten
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "title": "string",
    *   "description": "string",
    *   "promo": "string",
    *   "status": 1,
    *   "customerAddress": "string",
    *   "amount": 50,
    *   "currency": "string",
    *   "startTimestamp": 10,
    *   "endTimestamp": 11,
    *   "type": 1,
    *   "frequency": 10,
    *   "registerTxHash":"string",
    *   "executeTxHash":"string",
    *   "executeTxStatus": 1,
    *   "pullPaymentAddress": "string"
    *   "merchantAddress": "string"
    *   "networkID": number
    * }
    *
    * @apiSuccess (200) {object} updated paymentModel model details
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
    * @api {patch} /api/v1/paymentModel-models/:pullPaymentModelID
    * @apiDescription Patch existing paymentModel model in DB
    *
    * @apiName patch
    * @apiGroup PullPaymentModelController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} pullPaymentModelID - PaymentModel ID
    * @apiParam {string} title - Title of the paymentModel
    * @apiParam {string} description - Description of the paymentModel
    * @apiParam {string} promo - Promo code for the paymentModel
    * @apiParam {number} status - Status of paymentModel
    * @apiParam {string} customerAddress -
    * @apiParam {number} amount - Amount of paymentModel
    * @apiParam {string} currency - Currency of paymentModel
    * @apiParam {number} startTimestamp - Start timestamp of paymentModel
    * @apiParam {number} endTimestamp - End timestamp of paymentModel
    * @apiParam {number} type - Type of paymentModel
    * @apiParam {number} frequency - Frequency of execution
    * @apiParam {string} registerTxHash - Transaction hash for register pull paymentModel
    * @apiParam {string} executeTxHash - Transaction hash for execute pull paymentModel
    * @apiParam {number} executeTxStatus - Transaction hash status for execute pull paymentModel
    * @apiParam {string} pullPaymentAddress - Debit account for paymentModel
    * @apiParam {string} merchantAddress - Debit account for paymentModel
    * @apiParam {number} networkID - ETH Network ID - 1 mainnet / 3 ropsten
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "title": "string",
    *   "description": "string",
    *   "promo": "string",
    *   "status": 1,
    *   "customerAddress": "string",
    *   "amount": 50,
    *   "currency": "string",
    *   "startTimestamp": 10,
    *   "endTimestamp": 11,
    *   "type": 1,
    *   "frequency": 10,
    *   "registerTxHash":"string",
    *   "executeTxHash":"string",
    *   "executeTxStatus": 1,
    *   "pullPaymentAddress": "string"
    *   "merchantAddress": "string",
    *   "networkID": number
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
    * @api {delete} /api/v1/paymentModel-models/:pullPaymentModelID
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
    *   "pullPaymentModelID": "32049572038495"
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