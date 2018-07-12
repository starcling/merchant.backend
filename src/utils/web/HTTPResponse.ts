// tslint:disable:variable-name
export class HTTPResponse {
    private _statusCode: number;
    private _body: any;
    private _headers: any;

    public constructor(body: any, headers: any, statusCode: number) {
        this._statusCode = statusCode;
        this._body = body;
        this._headers = headers;
    }

    public get statusCode(): number {
        return this._statusCode;
    }

    public get body(): any {
        return this._body;
    }

    public get headers(): any {
        return this._headers;
    }

    public isSuccessfulRequest(): boolean {
        return this._statusCode >= 200 && this._statusCode < 300;
    }

    public isSuccessfulEtherscanRequest(): boolean {
        return this.isSuccessfulRequest() && JSON.parse(this._body).status !== 0 && JSON.parse(this._body).message !== 'NOTOK';
    }
}