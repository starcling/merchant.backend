import { IncomingMessage } from 'http';
import { HTTPResponse } from './HTTPResponse';
const request = require('request');
export class HTTPRequest {
    private url: string;
    private body: any;
    private queryParams: any;
    private headers: { [headerName: string]: string };
    private method: string;

    public constructor(url: string, headers: { [headerName: string]: string }, method: string, body?: any, queryParams?: any) {
        this.url = url;
        this.headers = headers;
        this.method = method;
        this.body = body ? JSON.stringify(body) : null;
        this.queryParams = queryParams ? queryParams : null;
    }

    public async getResponse(): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve: (httpResponse: HTTPResponse) => void, reject: (error: Error) => void) => {
            request({
                url: this.url,
                headers: this.headers,
                method: this.method,
                body: this.body,
                qs: this.queryParams
            }, (error: any, response: IncomingMessage, data: any) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(new HTTPResponse(data, response.headers, response.statusCode));
            });
        });
    }
}