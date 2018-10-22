import * as AWS from 'aws-sdk';

export class AwsEncryptionService {
  public async decrypt(cipher: string): Promise<any> {
    AWS.config.update({ region: process.env.AWS_REGION });
    const kms = new AWS.KMS();
    return new Promise((resolve, reject) => {
      kms.decrypt({
        CiphertextBlob: Buffer.from(cipher, 'base64')
      }, (err, data) => {
        if (err) {
          return reject(err.message);
        }

        return resolve(data.Plaintext.toString());
      });
    });
  }
}
