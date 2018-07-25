#!/bin/bash
echo "\n ================= Entering Merchant SDK directory \n"
cd ../merchant.sdk/
echo "\n ================= Clearing node modules \n"
rm -rf ./node_modules/
echo "\n ================= Deleting package-lock.json \n"
rm -rf ./package-lock.json
echo "\n ================= Install dependencies \n"
npm install
echo "\n ================= Pack Merchant SDK \n"
npm run pack-local
echo "\n ================= Entering Merchant backend directory \n"
cd ../merchant.backend/
echo "\n ================= Link Merchant SDK \n"
npm link puma_merchant_sdk

echo "\n ================= Selecting docker configuration file \n"

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

echo "\n ================= Selected docker configuration file: $file \n"

docker-compose -f $file down
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

# #!/bin/bash
# docker-compose down
# wait
# gulp
# wait
# docker-compose build
# wait
# # docker-compose up -d postgres
# # wait
# # sleep 10
# docker-compose up -d
# if [ "$#" -gt 0 ]
# then
#     docker-compose $1 -$2
# fi