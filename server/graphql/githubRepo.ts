import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import GithubData from "../models/GithubData.model";
import GithubRepo, { DeployStatus } from "../models/GithubRepo.model";
import redis from "../utils/redis";
import GithubRepoType from "./types/githubRepo";

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
            repo: repo.repo_name,
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
  addRepo: {
    type: GithubRepoType,
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
      const existing = await GithubRepo.findOne({
        where: {
          user_id: ctx.state.user.id,
          repo_name: args.repo_name,
          handle: args.handle,
        },
      });
      if (existing) {
        return existing;
      }
      return await GithubRepo.create({
        user_id: ctx.state.user.id,
        repo_name: args.repo_name,
        handle: args.handle,
      });
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
