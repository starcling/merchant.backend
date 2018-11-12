FROM keymetrics/pm2:latest-stretch

# Workdir
RUN mkdir -p /usr/src/app/
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz
WORKDIR /usr/src/app

COPY package.json package.json
RUN npm install --loglevel error
RUN npm cache clean --force

COPY . .