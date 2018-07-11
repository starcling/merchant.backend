import express from 'express';
import pumaMerchantSdk from 'puma-merchant-sdk';
require('dotenv').load();
const app = express();
// const API_URL = 'http://host.docker.internal/api/v1'; // When use docker
const API_URL = 'http://localhost:8081/api/v1/'; // When do not use docker

app.get('/', (req, res) => {
  const merchant = new pumaMerchantSdk({apiUrl: API_URL});

  merchant.authenticate('user', 'password').then(resp => {
    merchant.getRequest('/exchange/global').then(response => {
        console.debug('getRequest', response);

        res.send(response);
      }
    );
  }).catch(err => {
    console.debug('getRequest error', err);

    res.status(400).send(err);
  });
});

const server = app.listen(process.env.PORT, () => {
  console.log('Started at http://localhost:%d\n', server.address().port);
});
