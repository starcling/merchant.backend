#!/bin/bash

#echo "----------------------- Entering Merchant SDK directory"
cd ../merchant.sdk/
#echo "----------------------- Clearing node modules"
rm -rf ./node_modules/
#echo "----------------------- Deleting package-lock.json"
rm -rf ./package-lock.json
#echo "----------------------- Install dependencies"
npm install
#echo "----------------------- Pack Merchant SDK"
npm run pack-local
#echo "----------------------- Entering Merchant backend directory"
cd ../merchant.backend/
#echo "----------------------- Link Merchant SDK"
npm link puma_merchant_sdk

#echo "----------------------- Selecting docker configuration file"

dev="docker-compose.yml"
dev_remote="docker-compose.server.yml"
prod="docker-compose.yml"
prod_remote="docker-compose.server.yml"

case $1 in
    dev)       
        file=$dev
        ;;
    dev_remote)
        file=$dev_remote
        ;;            
    prod)       
        file=$prod
        ;;
    prod_remote)       
        file=$prod_remote
        ;;
    *)
        file=$dev
        ;;              
esac 

#echo "----------------------- Selected docker configuration file: $file"

docker-compose -f $file down
wait
gulp
wait
docker-compose -f $file build
wait
# docker-compose -f $file up -d postgres_core
# wait
# sleep 10
docker-compose -f $file up -d
if [ "$#" -gt 2 ]
then
    docker-compose -f $file $2 -$3
fi
