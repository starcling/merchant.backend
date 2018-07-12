import { HTTPResponseCodes } from '../web/HTTPResponseCodes';

export class APIResponseHandler {
    public handle(response: any, result: any): any {
        if (result.status) {
            return response.status(result.status).send(result);
        } else {
            return response.status(HTTPResponseCodes.INTERNAL_SERVER_ERROR()).send(result);
        }
    }

    public handleAuthentication(response: any, authenticationResponse: any): any {
        if (!authenticationResponse.success) {
            return response.status(400).json(authenticationResponse);
        } else if (authenticationResponse.error) {
            return response.status(500).send(authenticationResponse);
        } else {
            return response.status(200).json(authenticationResponse);
        }
    }
}
