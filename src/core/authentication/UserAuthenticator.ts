import * as jsonwebtoken from 'jsonwebtoken';
import {Password} from './Password';
import {Config} from '../../config';

export class UserAuthenticator {
  private TOKEN_LIFETIME_IN_SECONDS: number = 24 * 60 * 60; // 24 hours

  /**
  * @description Checks if the user's password is valid
  * @param {any} user The user to which the password will be validated
  * @param {string} password The password of the user
  * @returns {boolean} Returns true if the password is valid
  */
  public isValidPassword(user: any, password: string): boolean {
    return new Password(password, user.salt).toHash() === user.hash;
  }

  /**
  * @description Generates the json web token for the user
  * @param {Merchant} user The user to which the temporary password will be validated
  * @returns {string} Returns a string of the jwt
  */
  public generateToken(user: any): string {
    return jsonwebtoken.sign(user, Config.settings.serverSecret, {
      expiresIn: this.TOKEN_LIFETIME_IN_SECONDS
    });
  }

  /**
  * @description Get the json web token payload
  * @param {string} token The json web token
  * @returns Returns the decoded token payload
  */
  public getTokenPayload(token: string) {
    return jsonwebtoken.decode(token);
  }
}
