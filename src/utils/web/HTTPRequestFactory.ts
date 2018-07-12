import { HTTPRequest } from './HTTPRequest';

export class HTTPRequestFactory {
    public create(url: string, headers: { [headerName: string]: string }, method: string, body?: any, queryParams?: any): HTTPRequest {
        return new HTTPRequest(url, headers, method, body, queryParams);
    }
}