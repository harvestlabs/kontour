FROM node:16.13.1

WORKDIR /usr/src/app
RUN npm i hardhat dotenv ioredis graphql-redis-subscriptions
COPY . /usr/src/app

EXPOSE 80
ENTRYPOINT npx hardhat node --hostname 0.0.0.0 --port 80 | node piper.js