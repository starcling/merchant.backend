import { ExpressMiddlewareInterface } from 'routing-controllers';
import { MiddlewareHelper } from './MiddlewareHelper';
import { Globals } from '../utils/globals';
import { MobileTokenValidator } from '../utils/authentication/MobileTokenValidator';
import { HTTPRequestFactory } from '../utils/web/HTTPRequestFactory';
import { DefaultConfig } from '../config/default.config';

export class MobileValidationMiddleware implements ExpressMiddlewareInterface {

  public async use(req: any, response: any, next?: (err?: any) => any): Promise<any> {

    const token: string = MobileTokenValidator.GET_FCM_TOKEN_FROM_REQUEST(req);

    if (!token) {
      return new MiddlewareHelper().failValidation(response, 'No fcm token provided.');
    }

    if (process.env.NODE_ENV !== 'production' && token.indexOf(Globals.GET_TEST_FCM_TOKEN()) > -1) {
      return next();
    }

    const headers = {
      'Content-Type': 'application/json',
      [Globals.GET_CORE_API_KEY_NAME()]: Globals.GET_TEST_API_KEY()
    };
    const httpRequest = new HTTPRequestFactory()
      .create(`${DefaultConfig.settings.coreApiURL}${DefaultConfig.settings.mobileValidationUrl}${token}`,
        headers, 'GET');
    try {
      const httpResponse = await httpRequest.getResponse();
      if (httpResponse.isSuccessfulRequest()) {
        const success = 'JSON.parse(httpResponse.body).success';

        if (!success) {
          return new MiddlewareHelper().failValidation(response, 'Invalid mobile token');
        }

        return next();
      } else {
        return new MiddlewareHelper().failValidation(response, 'Invalid mobile token');
      }
    } catch (err) {
      return new MiddlewareHelper().failValidation(response, err.message);
    }

    // Call core api and check if mobile token is valid

    next();
  }
}
