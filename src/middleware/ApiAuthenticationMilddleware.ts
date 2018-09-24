import { ExpressMiddlewareInterface } from 'routing-controllers';
import { MiddlewareHelper } from './MiddlewareHelper';
import { ApiKeyHelper } from '../utils/authentication/ApiKeyHelper';
import { ApiKeyValidator } from '../utils/authentication/ApiKeyValidator';
import { Globals } from '../utils/globals';

export class ApiAuthenticationMiddleware implements ExpressMiddlewareInterface {
  public use(request: any, response: any, next?: (err?: any) => any): any {
    const token: string = ApiKeyHelper.GET_API_KEY_FROM_REQUEST(request);
    if (process.env.NODE_ENV !== 'production' && token.indexOf(Globals.GET_TEST_API_KEY()) > -1) {
      return next();
    }
    if (!token) {
      return new MiddlewareHelper().failValidation(response, 'No api key provided.');
    }
    if (!new ApiKeyValidator().isValidApiKey(token, request)) {
      return new MiddlewareHelper().failValidation(response, 'Invalid api key provided.');
    }
    next();
  }

}
