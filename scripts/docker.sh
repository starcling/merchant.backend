#!/bin/bash
docker-compose down
wait
gulp
wait
docker-compose build
wait
# docker-compose up -d postgres
# wait
# sleep 10
docker-compose up -d
if [ "$#" -gt 0 ]
then
    docker-compose $1 -$2
fi
