require("dotenv").config();

import * as Sentry from "@sentry/node";

import init from "../server/models/init";
import logger from "../server/utils/logger";
import redis from "../server/utils/redis";
import buildRepoTask from "./tasks/buildRepo";

Sentry.init({
  dsn: "https://5504983dab14488ea98faa202ce94ec6@o1099620.ingest.sentry.io/6124364",
  tracesSampleRate: 0,
});

init();

const queues = redis.WORKER_MSG_QUEUES;
const tasks = {
  [queues.buildGithubRepo.name]: buildRepoTask,
};

async function main() {
  logger.info("Listening");
  while (true) {
    let msg, ch;
    try {
      [ch, msg] = await redis.redisClient.blpop(redis.WORKER_LISTEN_QUEUE, 0);
    } catch (err) {
      logger.error("Error", { err });
      process.exit(1);
    }
    if (msg) {
      logger.info("Received message", { msg });
      const data = JSON.parse(msg);
      try {
        if (queues[data.type]) {
          const response = await tasks[queues[data.type].name](data.request);
          logger.info("Publishing response", { response });
          await redis.redisClient.publish(
            queues[data.type].receiveresponse,
            response
          );
        }
      } catch (err) {
        Sentry.withScope((scope) => {
          scope.setTag("env", process.env.NODE_ENV);
          scope.setTag("process", "worker");
          scope.setTag("task", data.type);
          Sentry.captureException(err);
        });
        logger.error("Error", [err]);
      }
    }
  }
}

main();
