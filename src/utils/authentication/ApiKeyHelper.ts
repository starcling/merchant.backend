import { Globals } from '../globals';

export class ApiKeyHelper {

    /**
    * @description Get the api key from the request
    * @param {any} request: The request coming for the api key
    * @returns {string}: Returns a string of the api key token
    */
    public static GET_API_KEY_FROM_REQUEST(request: any): string {
        let token = request.headers[Globals.GET_API_KEY_NAME()] as string;
        if (!token) {
            token = request.body ? request.body.token : null;
        }
        if (!token) {
            token = request.query ? request.query.token : null;
        }

        return token;
    }
}