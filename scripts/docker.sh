#!/bin/bash
npm link puma_merchant_sdk

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
        docker image prune -f
        ;;            
    prod)       
        file=$prod
        ;;
    prod_remote)       
        file=$prod_remote
        docker image prune -f
        ;;
    *)
        file=$dev
        ;;              
esac

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
