# Docker Compose for Node.js and PostgreSQL


## development
```
    npm run dev
```
## production
```
    npm start
```
## test
```
    npm run test
```

## Use docker
```
    docker-compose up
```

### Development Server
To push your local development branch, to test development server do the following setup:
1. create a `id_dsa` file in your `~/.ssh/` directory
```bash
$ touch ~/.ssh/id_dsa
```
2. Copy RSA private key from lastpass `https://lastpass.com/`
either use
```bash
$ vi ~/.ssh/id_dsa
```
or
```bash
$ nano ~/.ssh/id_dsa
```
and copy the private key from lastpass `https://lastpass.com/`
3. Set the permission os `id_dsa` file
```bash
$ chmod 400 ~/.ssh/id_dsa
```
After you setup your ssh key setup git remote:
```bash
$ git remote add development ssh://centos@18.196.208.131/home/centos/app/src/merchant.backend/
```

Your done!
To push the changes, make sure you are on development branch and do:
```bash
$ git push development
```


## WARNING
Don't keep `.env` file in the repo. It's here as it makes demo example simpler.
