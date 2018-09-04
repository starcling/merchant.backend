import { JsonController, Res, Post, Body, Get, Param, Delete } from 'routing-controllers';
import { APIResponseHandler } from '../../utils/APIResponseHandler/APIResponseHandler';
import { IPaymentContractInsert } from '../../core/contract/models';
import { ContractConnector } from '../../connectors/api/v1/ContractConnector';
import { CreateContractValidator } from '../../validators/ContractValidator/CreateContractValidator';
import { GetContractValidator } from '../../validators/ContractValidator/GetContractValidator';
import { DeleteContractValidator } from '../../validators/ContractValidator/DeleteContractValidator';

@JsonController('/contracts')
export class ContractController {

    /**
    * @apiDefine Response
    * @apiSuccess {boolean} success The HTTP success of the call
    * @apiSuccess {number} status The HTTP status of the call
    * @apiSuccess {string} message A human-friendly summary of the result of the call
    * @apiSuccess {object} data The response data of the call
    *
    */

    /**
    * @api {post} /api/v1/contracts/
    * @apiDescription Create a new Contract in DB
    *
    * @apiName create
    * @apiGroup ContractController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} title - Title of the Contract
    * @apiParam {string} description - Description of the Contract
    * @apiParam {number} amount - Amount of Contract
    * @apiParam {string} currency - Currency of Contract
    * @apiParam {number} startTimestamp - Start timestamp of Contract
    * @apiParam {number} endTimestamp - End timestamp of Contract
    * @apiParam {number} type - Type of Contract
    * @apiParam {string} merchantAddress - Ethereum wallet address of merchant
    * @apiParam {number} frequency - Frequency of execution
    * @apiParam {number} networkID - ETH Network ID - 1 mainnet / 3 ropsten
    *
    * @apiParamExample {json} Request-Example:
    * {
    * }
    *
    * @apiSuccess (200) {object} Contract Details
    *
    */
    @Post('/')
    public async create(@Body() contract: IPaymentContractInsert, @Res() response: any): Promise<any> {
        try {
            new CreateContractValidator().validate(contract);
            const result = await new ContractConnector().createContract(contract);

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
    * @api {get} /api/v1/contracts/:networkID
    * @apiDescription Retrieve an array of contracts
    *
    * @apiName getAllContracts
    * @apiGroup ContractController
    * @apiVersion  1.0.0
    *
    * @apiParam {number} networkID - ETH Network ID - 1 mainnet / 3 ropsten
    *
    * @apiSuccess (200) {object} Contract Details
    *
    */
   @Get('/')
   public async getAllContracts(@Res() response: any): Promise<any> {
       try {
           const result = await new ContractConnector().getAllContracts();

           return new APIResponseHandler().handle(response, result);
       } catch (error) {
           return new APIResponseHandler().handle(response, error);
       }
   }

    /**
    * @api {get} /api/v1/contracts/:contractID
    * @apiDescription Retrieves a single Contract
    *
    * @apiName getContract
    * @apiGroup ContractController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} contractID - ID of the Contract
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "contractID": "24947f2e-9164-11e8-bc8e-27e75bf6baf4"
    * }
    *
    * @apiSuccess (200) {object} Contract details for a specific id
    *
    */
    @Get('/:contractID')
    public async getContract(@Param('contractID') contractID: string, @Res() response: any): Promise<any> {
        try {
            new GetContractValidator().validate({ contractID });
            const result = await new ContractConnector().getContract(contractID);

            return new APIResponseHandler().handle(response, result);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }

    /**
    * @api {delete} /api/v1/contracts/:contractID
    * @apiDescription Delete a single Contract
    *
    * @apiName deleteContract
    * @apiGroup ContractController
    * @apiVersion  1.0.0
    *
    * @apiParam {string} contractID - ID of the Contract
    *
    * @apiParamExample {json} Request-Example:
    * {
    *   "contractID": "32049572038495"
    * }
    *
    * @apiSuccess (200) {object} no data
    *
    */
   @Delete('/:contractID')
   public async deleteContract(@Param('contractID') contractID: string, @Res() response: any): Promise<any> {
       try {
           new DeleteContractValidator().validate({ contractID });
           const result = await new ContractConnector().deleteContract(contractID);

           return new APIResponseHandler().handle(response, result);
       } catch (error) {
           return new APIResponseHandler().handle(response, error);
       }
   }

}