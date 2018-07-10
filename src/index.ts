import express from "express";
import * as MerchantSDK from "puma_sdk_core";
require('dotenv').load();
const app = express();

app.get("/", (req, res) => {
  

  const merchantWithoutApiKey = new MerchantSDK({apiUrl: 'http://localhost:8081/api/v1/'});

  merchantWithoutApiKey.authenticate('user', 'password').then(resp => {
    merchantWithoutApiKey.getRequest('/exchange/global').then(response => {
        console.debug('getRequest', response);
        res.send(`NODE_ENV=${process.env.NODE_ENV}`);
      }
    );
    /* merchantWithoutApiKey.postRequest('/schedule', {
        "signature": "",
        "signatory_address": "A",
        "debit_amount": 1,
        "debit_currency": "USD",
        "dest_address": "B",
        "saving_account": "",
        "enable_yn": "",
        "payment_id": "",
        "start_time": "",
        "end_time": "",
        "sequence": 1,
        "recurrence_type": "* * * * *",
        "limit": 100,
        "charge": ""
    }).then(res => 
        console.debug('postRequest', res)
    ); */

    
  }).catch(err => console.debug('getRequest error', err));

});

const server = app.listen(process.env.PORT, () => {
  console.log("Started at http://localhost:%d\n", server.address().port);
});
