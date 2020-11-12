FROM node:14-alpine3.12

WORKDIR /app

ADD . /app

RUN apk add -U git

RUN npm install

ENTRYPOINT ["evermark"]
