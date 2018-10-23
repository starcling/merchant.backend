import * as AWS from 'aws-sdk';
import { Globals } from '../globals';

export class AwsEncryptionService {

  public async decrypt(cipher: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        AWS.config.update({ region: process.env.AWS_REGION });
        const kms = new AWS.KMS();
        kms.decrypt({
          CiphertextBlob: Buffer.from(cipher, 'base64')
        }, (err, data) => {
          if (err) {
            return reject(err);
          }

          return resolve(data.Plaintext.toString());
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  public async encrypt(data: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        AWS.config.update({ region: process.env.AWS_REGION });
        const kms = new AWS.KMS();
        kms.encrypt({
          KeyId: Globals.GET_AWS_KEY_ID(),
          Plaintext: Buffer.from(data)
        }, (err, cipher) => {
          if (err) {
            return reject(err);
          }

          return resolve(cipher.CiphertextBlob.toString('base64'));
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}
