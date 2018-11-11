import * as jwt from 'jsonwebtoken';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import {JSONWebToken} from '../core/authentication/JSONWebToken';
import {Globals} from '../utils/globals';
import {MiddlewareHelper} from './MiddlewareHelper';
import {Config} from '../config';

export class UserAuthenticatorMiddleware implements ExpressMiddlewareInterface {
    public use(request: any, response: any, next?: (err?: any) => any): any {
        response.header('Access-Control-Allow-Headers',
            `Origin, X-Requested-With, Content-Type, Accept, ${Globals.GET_JWT_NAME()}`);

        const token = JSONWebToken.GET_JWT_TOKEN_FROM_REQUEST(request);
        if (!token) {
            return new MiddlewareHelper().failValidation(response, 'No user token provided.');
        }

        jwt.verify(token, Config.settings.serverSecret, (err: any, decoded: any) => {
            if (err) {
                return new MiddlewareHelper().failValidation(response, 'Invalid user token provided.');
            }
            next();
        });
    }
}
