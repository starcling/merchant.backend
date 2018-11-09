import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import {Globals} from '../../utils/globals';

export class JSONWebToken {
  public decodedToken: any;

  /**
  * @description Decode the json web token
  * @param {Request} request Request coming for decoding the jwt token
  */
  public constructor(request: Request) {
    this.decodedToken = jwt.decode(JSONWebToken.GET_JWT_TOKEN_FROM_REQUEST(request));
  }

  /**
  * @description Gets the json web token from the request
  * @param {Request} request Request coming for getting the jwt token
  * @returns {string} Returns the jwt token
  */
  public static GET_JWT_TOKEN_FROM_REQUEST(request: Request): string {
    let token = request.headers[Globals.GET_JWT_NAME()] as string;
    if (!token) {
      token = request.body ? request.body.token : null;
    }
    if (!token) {
      token = request.query ? request.query.token : null;
    }

    return token;
  }
}
