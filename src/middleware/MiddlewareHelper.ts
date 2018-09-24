export class MiddlewareHelper {
  public failValidation(response: any, message: string): void {
      response.status(401).json(<MiddlwareResponse>{
          success: false,
          status: 401,
          message: message
      });
  }
}

interface MiddlwareResponse {
  success: boolean;
  message: string;
  status: number;
}