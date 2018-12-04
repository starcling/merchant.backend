import {LoggerInstance} from 'winston';
import {HTTPResponseHandler} from '../../utils/web/HTTPResponseHandler';
import {DataService, ISqlQuery} from '../../utils/datasource/DataService';
import {HTTPResponseCodes} from '../../utils/web/HTTPResponseCodes';
import {UserAuthenticator} from './UserAuthenticator';

export class ClientAuthenticator {
    public constructor(private logger: LoggerInstance,
                       private email: string,
                       private password: string) {
    }

    public async authenticate(): Promise<AuthenticationResponse> {
        this.logger.info('Login attempt with email: ', this.email);
        let authResponse: AuthenticationResponse = {
            message: '',
            success: false
        };

        try {
            const sqlQuery: ISqlQuery = {
                text: `SELECT * FROM fc_get_user_by_email($1)`,
                values: [this.email]
            };

            const queryResult = await new DataService().executeQueryAsPromise(sqlQuery);

            if (queryResult.data[0].userID === null) {
                authResponse = <AuthenticationResponse>{
                    message: 'User does not exists.',
                    error: 'NO_USER',
                    success: false
                };

                return new HTTPResponseHandler().handleFailed(authResponse.message, authResponse.error, HTTPResponseCodes.BAD_REQUEST());
            }

            if (!new UserAuthenticator().isValidPassword(queryResult.data[0], this.password)) {
                authResponse = <AuthenticationResponse>{
                    message: 'Password is incorrect.',
                    error: 'WRONG_PASS',
                    success: false
                };

                return new HTTPResponseHandler().handleFailed(authResponse.message, authResponse.error, HTTPResponseCodes.UNAUTHORIZED());
            }
            const userData = {
                userID: queryResult.data[0].userID,
                firstName: queryResult.data[0].firstName,
                lastName: queryResult.data[0].lastName,
                email: queryResult.data[0].email
            };
            const message: string = `Successful login for user: ${this.email}`;
            const responseData = { user: userData, token: new UserAuthenticator().generateToken(queryResult.data[0])};

            return new HTTPResponseHandler().handleSuccess(message, responseData, HTTPResponseCodes.OK());
        } catch (error) {
            authResponse = <AuthenticationResponse>{
                message: error.message,
                error: error.code ? error.code : 'NO_CODE',
                success: false
            };

            return new HTTPResponseHandler().handleFailed(authResponse.message, authResponse.error);
        }
    }
}

export interface AuthenticationResponse {
    success: boolean;
    message: string;
    token?: string;
    api_key?: string;
    user?: any;
    error?: string;
}
