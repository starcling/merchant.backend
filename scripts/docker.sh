#!/bin/bash
dev="docker-compose.yml"
dev_remote="docker-compose.server.yml"
prod="docker-compose.yml"
prod_remote="docker-compose.server.yml"
file=$dev
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
esac 

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
