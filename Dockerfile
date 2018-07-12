FROM node:8.11

# Workdir
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app

COPY package.json package.json
RUN npm install --loglevel error
RUN npm cache clean --force

COPY . .