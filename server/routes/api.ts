import fs from "fs";
import Router from "koa-router";
import ApiKey from "../models/ApiKey.model";
import Project from "../models/Project.model";
import ProjectVersion from "../models/ProjectVersion.model";
import LocalContractSource from "../models/LocalContractSource.model";
import redis from "../utils/redis";
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
apiRouter.post("/ingestQuikdraw/start", async (ctx, next) => {
  const { apiKey: key, projectId, versionId } = ctx.request.body;
  const apiKey = await ApiKey.findByPk(key);
  if (!apiKey) {
    ctx.status = 400;
    next();
  }
  let project: Project;
  if (!projectId) {
    project = await Project.create({
      user_id: apiKey.user_id,
      data: {},
    });
  } else {
    project = await Project.findByPk(projectId);
    if (project.user_id !== apiKey.user_id) {
      ctx.status = 400;
      next();
    }
  }
  let version: ProjectVersion;
  if (!versionId) {
    version = await project.generateNewDraft();
  } else {
    version = await ProjectVersion.findByPk(versionId);
  }
  ctx.body = {
    projectId: project.id,
    versionId: version.id,
  };
  ctx.status = 200;
  next();
});
apiRouter.post("/ingestQuikdraw", async (ctx, next) => {
  const { apiKey: key, projectId, versionId } = ctx.request.body;
  const file = ctx.request.files.file;

  const apiKey = await ApiKey.findByPk(key);
  if (!projectId || !apiKey || !versionId) {
    ctx.status = 400;
    next();
  }
  const project = await Project.findByPk(projectId);
  if (project.user_id !== apiKey.user_id) {
    ctx.status = 400;
    next();
  }

  const fileChunks = [];
  const newSourceId = await new Promise<string>((resolve) => {
    // @ts-ignore
    const stream = fs.createReadStream(file.path);
    stream.on("data", (chunk) => {
      fileChunks.push(chunk);
    });
    stream.on("end", async () => {
      const data = Buffer.concat(fileChunks);

      const source = await LocalContractSource.uploadToS3(
        apiKey.user_id,
        JSON.parse(data.toString())
      );
      resolve(source.id);
    });
  });
  await redis.redisClient.sadd(versionId, newSourceId);
  ctx.status = 200;
  next();
});
apiRouter.post("/ingestQuikdraw/end", async (ctx, next) => {
  const { apiKey: key, projectId, versionId } = ctx.request.body;

  const apiKey = await ApiKey.findByPk(key);
  if (!projectId || !apiKey || !versionId) {
    ctx.status = 400;
    next();
  }
  const project = await Project.findByPk(projectId);
  if (project.user_id !== apiKey.user_id) {
    ctx.status = 400;
    next();
  }
  const allSources = await redis.redisClient.smembers(versionId);
  await redis.redisClient.del(versionId);
  const version = await ProjectVersion.findByPk(versionId);
  version.data = {
    ...version.data,
    local_source_ids: allSources,
  };
  await version.save();
  await version.createBlankHeadInstance();
  ctx.status = 200;
  next();
});
apiRouter.use(authRouter.routes(), authRouter.allowedMethods());

export default apiRouter;
