FMAINTAINER John Kelley johnkelley4477@gmail.com

## Use Alpine as the OS because of it's size
FROM alpine

## Update package definitions
RUN apk update

## Upgrade packages
RUN apk upgrade

## Add MongoDB
RUN apk add mongodb

## Install NodeJs
RUN apk add nodejs

## Install npm
RUN apk add --update nodejs nodejs-npm

## Install GIT
RUN apk add git

## Move to dev folder
RUN git clone https://github.com/johnkelley4477/Pack97NodeJSBE.git:develop

## Delete GIT
RUN apk del git

## Create Working Dir
WORKDIR /Pack97NodeJSBE

## Install dependances
## RUN npm install

EXPOSE 3004

## CMD [ "npm", "start" ]