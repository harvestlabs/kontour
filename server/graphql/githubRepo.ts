import { App } from "@octokit/app";
import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";
import config from "../../config";
import ApiKey from "../models/ApiKey.model";
import GithubData from "../models/GithubData.model";
import GithubRepo, { DeployStatus } from "../models/GithubRepo.model";
import Project from "../models/Project.model";
import redis from "../utils/redis";
import GithubRepoType from "./types/githubRepo";
import ProjectType from "./types/project";

const GithubRepoQueries = {
  myGithubRepos: {
    type: new GraphQLNonNull(
      new GraphQLList(new GraphQLNonNull(GithubRepoType))
    ),
    args: {},
    resolve: async (parent, args, ctx, info) => {
      if (!ctx.state?.user?.id) {
        return [];
      }
      return await GithubRepo.findAll({
        where: {
          user_id: ctx.state.user.id,
        },
      });
    },
  },
  searchGithubRepos: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLJSON))),
    args: {},
    resolve: async (parent, args, ctx, info) => {
      if (!ctx.state?.user?.id) {
        return [];
      }
      const installations = await GithubData.findAll({
        where: {
          user_id: ctx.state.user.id,
        },
      });
      const appOctokit = new App({
        appId: config.github.APP_ID,
        privateKey: config.github.APP_PK,
      });
      const repos = await Promise.all(
        installations.map(async (i) => {
          const kit = await appOctokit.getInstallationOctokit(
            Number(i.github_app_install_id)
          );
          return await kit.request("GET /installation/repositories");
        })
      );
      const result = [];
      repos.forEach((r) => {
        r.data.repositories.forEach((r2) => {
          const { name, full_name, owner } = r2;
          result.push({
            repo_name: name,
            full_repo_name: full_name,
            handle: owner.login,
            id: owner.id,
          });
        });
      });
      return result;
    },
  },
};

const GithubRepoMutations = {
  deployFromRepo: {
    type: GithubRepoType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const repo = await GithubRepo.findByPk(args.id);
      if (ctx.state?.user?.id !== repo.user_id) {
        return null;
      }
      await redis.redisClient.rpush(
        redis.WORKER_LISTEN_QUEUE,
        JSON.stringify({
          type: redis.WORKER_MSG_QUEUES.buildGithubRepo.name,
          request: {
            repoId: repo.id,
            repoName: repo.repo_name,
            handle: repo.handle,
            installId: await repo.getInstallId(),
            branch: "master",
            ...repo.deploy_data,
          },
        })
      );
      repo.deploy_status = DeployStatus.IN_PROGRESS;
      return await repo.save();
    },
  },
  addRepoAndCreateProject: {
    type: ProjectType,
    args: {
      repo_name: {
        type: new GraphQLNonNull(GraphQLString),
      },
      handle: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const data = await GithubData.findOne({
        where: {
          github_handle: args.handle,
          user_id: ctx.state?.user?.id,
        },
      });
      if (!data) {
        return null;
      }
      const { project, version } =
        await Project.createProjectWithDefaultVersion({
          user_id: ctx.state.user.id,
          project_metadata: {
            name: args.repo_name,
          },
          version_metadata: {},
        });
      const apiKey = await ApiKey.getOrCreateForUser(ctx.state.user.id);
      await GithubRepo.create({
        user_id: ctx.state.user.id,
        repo_name: args.repo_name,
        handle: args.handle,
        project_id: project.id,
        deploy_data: {
          apiKey: apiKey.key,
          projectId: project.id,
          versionId: version.id,
        },
      });
      return project;
    },
  },
  updateDeployParams: {
    type: GithubRepoType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
      deploy_params: {
        type: new GraphQLNonNull(GraphQLJSONObject),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const repo = await GithubRepo.findByPk(args.id);
      if (ctx.state?.user?.id !== repo.user_id) {
        return null;
      }
      repo.deploy_data = {
        ...repo.deploy_data,
        ...args.deploy_params,
      };
      return await repo.save();
    },
  },
};

export { GithubRepoQueries, GithubRepoMutations };
