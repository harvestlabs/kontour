import redis from "../../server/utils/redis";

const buildId = process.argv[2];

let MSGS = [];
const TO_PUBLISH_LEN = 25;

process.stdin.on("readable", () => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    const lines = chunk.toString();
    process.stdout.write(lines);
    lines.split("\n").forEach((line) => {
      if (line.length) {
        MSGS.push(line);
        if (MSGS.length === TO_PUBLISH_LEN) {
          redis.pubsub.publish("build_task", {
            message: MSGS.join("\n"),
            buildId: buildId,
          });
          MSGS = [];
        }
      }
    });
  }
});

process.stdin.on("end", () => {
  redis.pubsub.publish("build_task", {
    message: MSGS.join("\n"),
    buildId: buildId,
  });
  process.exit(0);
});
