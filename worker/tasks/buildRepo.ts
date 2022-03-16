import fs from "fs";
import { App } from "@octokit/app";
import { exec, execSync } from "child_process";
import path from "path";
import { v4 } from "uuid";
import config from "../../config";

export interface Request {
  repo: string;
  handle: string;
  installId: number;
  branch: string;
  buildCmd: string; // relative to buildDir
  buildDir: string; // relative to root of repo
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
      repo: data.repo,
      ref: data.branch,
    }
  );
  const dir = v4();

  const currDir = process.cwd();
  fs.mkdirSync(path.resolve(currDir, dir));

  let cwd = path.resolve(currDir, dir);
  fs.writeFileSync(`${cwd}/data.zip`, Buffer.from(zip as string));
  execSync("unzip data.zip", {
    cwd: cwd,
    stdio: "inherit",
  });
  execSync("rm data.zip", {
    cwd: cwd,
    stdio: "inherit",
  });
  console.log("asdf8");
  // Go into the unzipped folder
  const files = fs.readdirSync(cwd);
  cwd = path.resolve(cwd, files[0]);
  if (data.buildDir) {
    cwd = path.resolve(cwd, data.buildDir);
  }
  execSync(data.buildCmd, {
    cwd: cwd,
    stdio: "inherit",
  });
  // Try uploading with quikdraw
  fs.writeFileSync(
    `${cwd}/.quikdrawconfig`,
    JSON.stringify({
      type: data.type,
      truffleConfigPath: data.truffleConfigPath,
      apiKey: data.apiKey,
      projectId: data.projectId,
      versionId: data.versionId,
    })
  );
  execSync("npm i quikdraw@0.1.2", {
    cwd: cwd,
    stdio: "inherit",
  });
  execSync("npx quikdraw go", {
    cwd: cwd,
    stdio: "inherit",
  });
  fs.rmdirSync(dir);
  return {};
}
