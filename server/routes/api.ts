import fs from "fs";
import Router from "koa-router";
import ApiKey from "../models/ApiKey.model";
import Project from "../models/Project.model";
import Node from "../models/Node.model";
import ProjectVersion from "../models/ProjectVersion.model";
import LocalContractSource, {
  SourceType,
} from "../models/LocalContractSource.model";
import redis from "../utils/redis";
import authRouter from "./auth";
import Contract, { ContractSourceType } from "../models/Contract.model";

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
    return;
  }
  let project: Project;
  let node: Node;
  if (!projectId) {
    project = await Project.create({
      user_id: apiKey.user_id,
      data: {},
    });
    node = await project.$get("node");
  } else {
    project = await Project.findByPk(projectId, { include: Node });
    if (project.user_id !== apiKey.user_id) {
      ctx.status = 400;
      return;
    }
    node = project.node;
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
    return;
  }
  const project = await Project.findByPk(projectId);
  if (project.user_id !== apiKey.user_id) {
    ctx.status = 400;
    return;
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
      if (!source) {
        resolve(null);
      }
      resolve(source.id);
    });
  });
  if (newSourceId) {
    await redis.redisClient.sadd(versionId, newSourceId);
  }
  ctx.status = 200;
  next();
});
apiRouter.post("/ingestQuikdraw/end", async (ctx, next) => {
  const { apiKey: key, projectId, versionId } = ctx.request.body;

  const apiKey = await ApiKey.findByPk(key);
  if (!projectId || !apiKey || !versionId) {
    ctx.status = 400;
    return;
  }
  const project = await Project.findByPk(projectId);
  if (project.user_id !== apiKey.user_id) {
    ctx.status = 400;
    return;
  }
  const allSources = await redis.redisClient.smembers(versionId);
  const localSources = await LocalContractSource.findAll({
    where: { id: allSources },
  });
  const nameToId = {};
  localSources.forEach((s) => {
    nameToId[s.name] = s.id;
  });
  await redis.redisClient.del(versionId);
  const version = await ProjectVersion.findByPk(versionId);
  version.data = {
    ...version.data,
    local_sources: {
      ...version.data.local_sources,
      ...nameToId,
    },
  };
  console.log("version", version.data);
  await version.save();
  const instance = await version.createBlankHeadInstance();
  if (instance) {
    await Promise.all(
      localSources
        .filter((s) => s.type === SourceType.LIB)
        .map((s) => {
          return Contract.importFromSource(
            s,
            ContractSourceType.LOCAL,
            instance.id,
            []
          );
        })
    );
  }

  ctx.status = 200;
  next();
});
apiRouter.post("/ingestQuikdraw/migrate", async (ctx, next) => {
  const {
    apiKey: key,
    projectId,
    versionId,
    contractName,
    args = [],
  } = ctx.request.body;
  const apiKey = await ApiKey.findByPk(key);
  if (!projectId || !apiKey || !versionId) {
    ctx.status = 400;
    return;
  }
  const project = await Project.findByPk(projectId);
  if (project.user_id !== apiKey.user_id) {
    ctx.status = 400;
    return;
  }
  const version = await ProjectVersion.findByPk(versionId);
  const instance = await version.getHead();
  const contractSourceId = version.data?.local_sources[contractName];
  if (!contractSourceId) {
    ctx.status = 400;
    return;
  }
  const source = await LocalContractSource.findByPk(contractSourceId);
  const contract = await Contract.importFromSource(
    source,
    ContractSourceType.LOCAL,
    instance.id,
    args
  );
  ctx.body = {
    id: contract.id,
    address: contract.address,
    node_id: contract.node_id,
    params: contract.constructor_params,
    instance_id: instance.id,
    version_id: version.id,
  };
  ctx.status = 200;
  next();
});
apiRouter.use(authRouter.routes(), authRouter.allowedMethods());

export default apiRouter;
