# PumaPay Merchant Backend

The v2.0 of the PumaPay PullPayment protocol on the merchant side consists of a set of APIs that the merchant can use to connect to the
rest of the PumaPay ecosystem. All the relevant core functionality is provided by the PumaPay merchant SDK.

## Components
### NodeJS
The NodeJS server uses the merchant SDK as a singleton and provides a list of API methods that are used to specify their own billing models,
to register the PullPayments of their customers as well as executing and monitoring the blockchain transactions related with the PullPayments.
### PostgreSQL DB
The PostgreSQL database stores the billing models, the PullPayments and the Ethereum transactions.
### MySQL DB
MySQL database is an encrypted database used for encrypting the HD wallet with the Ethereum addresses that the merchant
uses on their end for executing PullPayments on the blockchain, for funding the PullPayment account addresses with ETH
to pay for gas and cashing out PMA and ETH to a treasury account on their end.
### Redis
Redis in-memory data structure store is used for storing information related to the PullPayment account address that will be executing the
PullPayment and for storing the maximum gas used for a PullPayment transaction.


## Pre-requisites
* [Install Node and NPM](https://www.npmjs.com/get-npm)
* [Install Docker](https://docs.docker.com/engine/installation/)

### Getting Started NodeJS
1. Clone the repo
```
$ git clone https://github.com/pumapayio/merchant.backend.git
```
2.  Change to project directory
```
$ cd merchant.backend
```
3. Install Dependencies
```
$ npm install
```
4. Setup PostgreSQL DB
```
$ docker-compose up -d postgres_merchant
```
5. Setup MySQL DB
```
$ docker-compose up -d merchant_db
```
6. Setup MySQL DB
```
$ docker-compose up -d merchant_redis
```
7. Start NodeJS server
```
$ npm run
```
Server is up and running on `http://localhost:3000/`

To check the API Swagger file `http://localhost:3000/api/v2/docs/api/`

### Getting Started Docker
1. Clone the repo
```
$ git clone https://github.com/pumapayio/merchant.backend.git
```
2.  Change to project directory
```
$ cd merchant.backend
```
3. Build docker image
```
$ docker-compose build
```
4. Start docker containers
```
$ docker-compose up -d
```

Server is up and running on `http://localhost:3000/`

To check the API Swagger file `http://localhost:3000/api/v2/docs/api/`

### Testing
1. Follow getting started
2. Run e2e tests
```
$ npm run test-e2e
```
3. Run unit tests
```
$ npm run test-unit
```
4. Run all tests
```
$ npm run test
```

## Code of Conduct

In order to have a more open and welcoming community, PumaPay adheres to a code of conduct adapted from [W3C’s Code of Ethics and Professional Conduct](https://www.w3.org/Consortium/cepc) with some additions from the [Cloud Foundry's](https://www.cloudfoundry.org/) Code of Conduct.

Please adhere to this [code of conduct](./CODE_OF_CONDUCT.md) in any interactions you have in the PumaPay community. It is strictly enforced on all official PumaPay repositories, websites, and resources. If you encounter someone violating these terms, please let one of our core team members know and we will address it as soon as possible.

## License
This software is under the MIT License.

See the full [LICENCE](./LICENCE) file.