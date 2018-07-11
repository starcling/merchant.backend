import express from "express";
import MerchantSDK from "puma-merchant-sdk";
require('dotenv').load();
const app = express();

app.get("/", (req, res) => {
  

  const merchantWithoutApiKey = new MerchantSDK({apiUrl: 'http://localhost:8081/api/v1/'});

  merchantWithoutApiKey.authenticate('user', 'password').then(resp => {
    merchantWithoutApiKey.getRequest('/exchange/global').then(response => {
        console.debug('getRequest', response);
        res.send(response);
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

    
  }).catch(err => {
    console.debug('getRequest error', err);
    res.status(400).send(err);
  });

});

const server = app.listen(process.env.PORT, () => {
  console.log("Started at http://localhost:%d\n", server.address().port);
});
