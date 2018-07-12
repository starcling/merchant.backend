export class HTTPResponseHandler {
    public handleSuccess(message: string, data: any, status?: number, token?: string) {
        return <IResponseMessage>{
            success: true,
            status: status ? status : 200,
            message: message,
            data: data,
            token: token
        };
    }

    public handleFailed(message: string, error: any, status?: number) {
        return <IResponseMessage>{
            success: false,
            status: status ? status : 500,
            message: message,
            error: error
        };
    }
}

export interface IResponseMessage {
    success: boolean;
    status: number;
    message: string;
    data?: any;
    token?: string;
    error?: string;
}