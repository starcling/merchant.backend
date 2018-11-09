import { pbkdf2Sync } from 'crypto';

export class Password {
  public constructor(private password: string, private salt: string) {
  }

  /**
  * @description Hash the password
  * @returns {string} Returns a string of the created hash
  */
  public toHash(): string {
    return pbkdf2Sync(this.password, this.salt, 1000, 64, 'sha256').toString('hex');
  }
}
