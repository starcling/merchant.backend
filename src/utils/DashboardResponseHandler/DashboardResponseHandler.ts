import { IResponseMessage } from '../../utils/web/HTTPResponseHandler';

export class DashboardResponseHandler {
    public handleSuccess(message: string, data: any) {
        return <IResponseMessage>{
            success: true,
            status: 200,
            message: message,
            data: data
        };
    }

    public handleFailed(message: string, error: any) {
        return <IResponseMessage>{
            success: false,
            status: 500,
            message: message,
            error: error
        };
    }
}
