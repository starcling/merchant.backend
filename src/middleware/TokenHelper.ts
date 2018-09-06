export class TokenHelper {

  /**
  * @description Get the fcm token the request
  * @param {any} request: The request coming from the mobile app
  * @returns {string}: Returns a string of tfcm token
  */
  public static GET_FCM_TOKEN_FROM_REQUEST(request: any): string {
      let token =  request.body ? request.body.fcmToken : null;
      if (!token) {
          token = request.query ? request.query.fcmToken : null;
      }

      return token;
  }
}