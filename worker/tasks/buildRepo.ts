import fs from "fs";
import { App } from "@octokit/app";
import { exec, execSync } from "child_process";
import redis from "../../server/utils/redis";
import path from "path";
import { v4 } from "uuid";
import GithubRepo, { DeployStatus } from "../../server/models/GithubRepo.model";
import config from "../../config";

export interface Request {
  repoId: string;
  repoName: string;
  handle: string;
  installId: number;
  branch: string;
  buildCmd: string; // relative to buildDir
  buildDir: string; // relative to root of repo
  deployScript: string; // relative to root of repo
  // Quikdraw configs
  apiKey: string;
  type: string;
  truffleConfigPath: string;
  projectId: string;
  versionId: string;
}

export interface Response {}

export default async function BuildRepoTasks(data: Request): Promise<Response> {
  const appOctokit = new App({
    appId: config.github.APP_ID,
    privateKey: config.github.APP_PK,
  });
  const octokit = await appOctokit.getInstallationOctokit(data.installId);

  const { data: zip } = await octokit.request(
    "GET /repos/{owner}/{repo}/zipball/{ref}",
    {
      owner: data.handle,
      repo: data.repoName,
      ref: data.branch,
    }
  );
  let dir;
  let repo;
  try {
    dir = v4();
    const currDir = process.cwd();
    redis.pubsub.publish("build_task", {
      message: `Starting build for ${data.repoId}\nDownloading from Github...\nFiles extracted`,
      buildId: data.repoId,
    });

    const pipeScript = `node ${__dirname}/piper.js ${data.repoId}`;
    fs.mkdirSync(path.resolve(currDir, dir));

    let cwd = path.resolve(currDir, dir);
    fs.writeFileSync(`${cwd}/data.zip`, Buffer.from(zip as string));
    execSync(`unzip data.zip | ${pipeScript}`, {
      cwd: cwd,
      stdio: "inherit",
    });
    execSync(`rm data.zip | ${pipeScript}`, {
      cwd: cwd,
      stdio: "inherit",
    });
    console.log("moving into build directory", cwd);
    // Go into the unzipped folder
    const files = fs.readdirSync(cwd);
    cwd = path.resolve(cwd, files[0]);
    if (data.buildDir) {
      cwd = path.resolve(cwd, data.buildDir);
    }
    console.log("running npm install --production=false");
    redis.pubsub.publish("build_task", {
      message: `Running npm install --production=false`,
      buildId: data.repoId,
    });
    execSync(`2>&1 npm install --production=false | ${pipeScript}`, {
      cwd: cwd,
      stdio: "inherit",
    });

    if (data.buildCmd) {
      console.log("running build command", data.buildCmd);
      redis.pubsub.publish("build_task", {
        message: `Running ${data.buildCmd}`,
        buildId: data.repoId,
      });
      execSync(`2>&1 ${data.buildCmd} | ${pipeScript}`, {
        cwd: cwd,
        stdio: "inherit",
      });
    }
    console.log("writing .quikdrawconfig", cwd);
    // Try uploading with quikdraw
    fs.writeFileSync(
      `${cwd}/.quikdrawconfig`,
      JSON.stringify({
        type: data.type,
        truffleConfigPath: data.truffleConfigPath,
        apiKey: data.apiKey,
        projectId: data.projectId,
        versionId: data.versionId,
        deploy: data.deployScript,
      })
    );
    console.log("installing quikdraw", cwd);
    redis.pubsub.publish("build_task", {
      message: `Writing .quikdrawconfig\nInstalling quikdraw`,
      buildId: data.repoId,
    });
    execSync(`2>&1 npm i quikdraw@${config.quikdraw.VERSION} | ${pipeScript}`, {
      cwd: cwd,
      stdio: "inherit",
    });
    execSync(`2>&1 npx quikdraw go | ${pipeScript}`, {
      cwd: cwd,
      stdio: "inherit",
    });
    if (data.deployScript) {
      execSync(`2>&1 npx quikdraw deploy | ${pipeScript}`, {
        cwd: cwd,
        stdio: "inherit",
      });
    }
    repo = await GithubRepo.findByPk(data.repoId);
    repo.deploy_status = DeployStatus.SUCCESS;
  } catch (e) {
    console.log("error", e);
    repo = await GithubRepo.findByPk(data.repoId);
    repo.deploy_status = DeployStatus.FAILED;
  } finally {
    await repo.save();
    fs.rmSync(dir, {
      recursive: true,
      force: true,
    });
  }
  return {};
}
