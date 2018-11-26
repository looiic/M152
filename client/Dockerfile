FROM node:10.13.0-alpine

USER root

RUN npm install -g @angular/cli

WORKDIR /home/node/app

COPY m152 /home/node/app/



RUN npm install

EXPOSE 4200
