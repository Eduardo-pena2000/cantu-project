FROM node:21-alpine as build-image

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./src ./src
COPY tsconfig.json ./

RUN npm run build

FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=build-image /usr/src/app/node_modules ./node_modules
COPY --from=build-image /usr/src/app/dist ./dist
COPY package*.json ./

CMD [ "npm", "start" ]