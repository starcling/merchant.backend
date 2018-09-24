import { Config } from '../../config';
import { Globals } from '../../utils/globals';

export class ApiKeyValidator {
  private secretKey: string = Config.settings.serverSecret;

  /**
  * @description Validates the PMA API Key
  * @param {string} apiKey: PMA API Key sent with the request
  * @param {any} request: Request coming to the API for validation
  * @param {Merchant} merchant: Merchant for which the API Key should be validated against
  * @returns {boolean}: Returns true if there is a match between the hashed parameters and the API Key sent
  */
  public isValidApiKey(apiKey: string, request: any): boolean {

    // TODO Check if provided merchant is in the db
    // const hash = crypto.createHmac('sha512', this.secretKey)
    //     .update(`${merchant.merchantID}${merchant.registrationDate}`)
    //     .digest('hex');
    // TODO Check it provided apiKey is valid
    // Where do we store valid apiKeys, in a database?
    return true;
    //return !(apiKey.match(hash) === null);
  }
}