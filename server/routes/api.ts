import fs from "fs";
import Router from "koa-router";
import ApiKey from "../models/ApiKey.model";
import S3ContractSource from "../models/S3ContractSource.model";
import authRouter from "./auth";

const apiRouter = new Router({
  prefix: "/api",
});
apiRouter.get("/status", async (ctx, next) => {
  ctx.body = {
    status: "ok",
  };
  ctx.status = 200;
  next();
});
apiRouter.post("/ingestQuikdraw", async (ctx, next) => {
  const { apiKey: key } = ctx.request.body;
  const file = ctx.request.files.file;

  const fileChunks = [];
  const apiKey = await ApiKey.findByPk(key);
  await new Promise<void>((resolve) => {
    // @ts-ignore
    const stream = fs.createReadStream(file.path);
    stream.on("data", (chunk) => {
      fileChunks.push(chunk);
    });
    stream.on("end", async () => {
      const data = Buffer.concat(fileChunks);

      await S3ContractSource.uploadToS3(
        apiKey.user_id,
        JSON.parse(data.toString())
      );
      resolve();
    });
  });
  ctx.status = 200;
  next();
});
apiRouter.use(authRouter.routes(), authRouter.allowedMethods());

export default apiRouter;
