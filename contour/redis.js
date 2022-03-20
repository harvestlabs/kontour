require("dotenv").config();
const Redis = require("ioredis");
const { RedisPubSub } = require("graphql-redis-subscriptions");

const newClient = () => {
  return new Redis(process.env.REDIS_URL, {
    username: process.env.REDIS_USER,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    family: 4,
    password: process.env.REDIS_PASSWORD,
  });
};
const redisClient = newClient();

const pubsub = new RedisPubSub({
  publisher: newClient(),
  subscriber: newClient(),
});

module.exports = {
  redisClient,
  pubsub,
};
