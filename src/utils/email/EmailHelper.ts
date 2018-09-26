const sgMail = require('@sendgrid/mail');
import { Globals } from '../globals';

export class EmailHelper {
    public sendContractLowBalanceEmail(email: string, contractAddress: string) {
        sgMail.setApiKey(Globals.GET_SQ_MAIL_API_KEY());
        const msg = {
            from: '"PumaPay" <support@pumapay.io>', // sender address
            to: email, // list of receivers
            subject: 'PumaPay Contract Low on Ether!', // Subject line
            // tslint:disable-next-line:max-line-length
            text: `Pull Payment Contract at ${contractAddress} is getting low on ethers, please top up!`, // plain text body
            // tslint:disable-next-line:max-line-length
            html: `<p><b>Pull Payment Contract at ${contractAddress} is getting low on ethers, please top up!</b></p>` // html body
        };

        sgMail.send(msg).then(() => {
            // TODO: Handle Properly
            console.debug('Message send to:', email);
        }).catch(error => {
            // TODO: Handle Properly
            console.debug('Error:::', error.toString());
        });
    }
}