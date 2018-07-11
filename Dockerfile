FROM node:8.11

# Workdir
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app
COPY . .
RUN npm install --loglevel error
RUN npm cache clean --force
