require("dotenv").config();
const Redis = require("ioredis");
const { RedisPubSub } = require("graphql-redis-subscriptions");

const redisOptions = process.env.REDIS_URL || {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  family: 4,
  password: process.env.REDIS_PASSWORD,
};
const redisClient = new Redis(redisOptions);

const pubsub = new RedisPubSub({
  publisher: new Redis(redisOptions),
  subscriber: new Redis(redisOptions),
});

module.exports = {
  redisClient,
  pubsub,
};
