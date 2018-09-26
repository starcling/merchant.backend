import { Globals } from '../../utils/globals';
export class MobileTokenValidator {

  /**
  * @description Get the fcm token the request
  * @param {any} request: The request coming from the mobile app
  * @returns {string}: Returns a string of tfcm token
  */
  public static GET_FCM_TOKEN_FROM_REQUEST(request: any): string {
    const fcmTokenName = Globals.GET_FCM_MOBILE_TOKEN_NAME();
    let token = request.headers[fcmTokenName] as string;
    if (!token) {
      token = request.body ? request.body[fcmTokenName] : null;
    }
    if (!token) {
      token = request.query ? request.query[fcmTokenName] : null;
    }

    return token;
  }
}