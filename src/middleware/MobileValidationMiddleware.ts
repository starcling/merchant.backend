import { ExpressMiddlewareInterface } from 'routing-controllers';
import { MiddlewareHelper } from './MiddlewareHelper';
import { Globals } from '../utils/globals';
import { MobileTokenValidator } from '../utils/authentication/MobileTokenValidator';
import { MerchantSDK } from '../core/MerchantSDK';

export class MobileValidationMiddleware implements ExpressMiddlewareInterface {

    public async use(req: any, response: any, next?: (err?: any) => any): Promise<any> {

        const token: string = MobileTokenValidator.GET_AUTH_TOKEN_FROM_REQUEST(req);

        if (!token) {
            return new MiddlewareHelper().failValidation(response, 'No mobile auth token provided.');
        }

        if (process.env.NODE_ENV !== 'production' && token.indexOf(Globals.GET_TEST_FCM_TOKEN()) > -1) {
            return next();
        }

        try {
            const result = MerchantSDK.GET_SDK().validateSecretPhrase(token);
            if (result) {

                return next();
            } else {
                return new MiddlewareHelper().failValidation(response, 'Invalid mobile token');
            }
        } catch (err) {
            return new MiddlewareHelper().failValidation(response, err.message);
        }

    }
}
