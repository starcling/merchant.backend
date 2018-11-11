
import { JsonController, Post, Body, Res } from 'routing-controllers';
import { Container } from 'typedi';
import { LoggerInstance } from 'winston';
import {LoggerFactory} from '../../utils/logger';
import {AuthenticationResponse, ClientAuthenticator} from '../../core/authentication/ClientAuthenticator';
import {APIResponseHandler} from '../../utils/APIResponseHandler/APIResponseHandler';

class LoginParams {
    public email: string;
    public password: string;
}

@JsonController('/login')
export class LoginController {
    private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('LoginController');

    @Post('/')
    public async login(@Body() loginParams: LoginParams, @Res() response: any): Promise<AuthenticationResponse> {
        const clientAuthenticator = new ClientAuthenticator(
            this.logger,
            loginParams.email,
            loginParams.password
        );

        try {
            const authenticationResponse = await clientAuthenticator.authenticate();

            return new APIResponseHandler().handle(response, authenticationResponse);
        } catch (error) {
            return new APIResponseHandler().handle(response, error);
        }
    }
}
