import { ExpressMiddlewareInterface } from 'routing-controllers';
import { MiddlewareHelper } from './MiddlewareHelper';
import { Globals } from '../utils/globals';
import { TokenHelper } from './TokenHelper';

export class MobileValidationMiddleware implements ExpressMiddlewareInterface {

  public use(request: any, response: any, next?: (err?: any) => any): any {
    next();

    const token: string = TokenHelper.GET_FCM_TOKEN_FROM_REQUEST(request);
    if (!token) {
      return new MiddlewareHelper().failValidation(response, 'No fcm token provided.');
    }
    // Call core api and check if mobile token is valid

    next();
  }
}
