FROM node:22-alpine as builder

RUN mkdir -p /root/src

WORKDIR /root/src

COPY ["package.json", "package-lock.json", "./"]

RUN npm i

COPY . ./

CMD [ "npm", "start" ]
