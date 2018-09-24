import { Config } from '../../config';
import { Globals } from '../../utils/globals';

export class ApiKeyValidator {
  /**
  * @description Validates the PMA API Key
  * @param {string} apiKey: PMA API Key sent with the request
  * @param {any} request: Request coming to the API for validation
  * @param {Merchant} merchant: Merchant for which the API Key should be validated against
  * @returns {boolean}: Returns true if there is a match between the hashed parameters and the API Key sent
  */
  public isValidApiKey(apiKey: string, request: any): boolean {
    const coreApiKey = Globals.GET_CORE_API_KEY();
    if (coreApiKey.indexOf(apiKey) === 0 && coreApiKey.length === apiKey.length) {
      return true;
    }

    return false;
  }
}