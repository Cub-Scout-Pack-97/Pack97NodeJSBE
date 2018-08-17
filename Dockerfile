FROM mhart/alpine-node:latest
## Use Alpine as the OS because of it's size

MAINTAINER John Kelley johnkelley4477@gmail.com

## Update package definitions
RUN apk upgrade --update

## Add MongoDB
## RUN apk add mongodb

## Install GIT
RUN apk add git

## Move to dev folder
RUN git clone https://github.com/johnkelley4477/Pack97NodeJSBE.git

## Create Working Dir
WORKDIR /Pack97NodeJSBE

## Checkout develop branch
RUN git checkout develop

## Delete GIT
##RUN apk del git

## Install dependances
RUN npm install

EXPOSE 4477

CMD ["git pull https://github.com/johnkelley4477/Pack97NodeJSBE.git develop", "npm install", "node index.js"]