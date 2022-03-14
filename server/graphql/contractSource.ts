import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import RemoteContractSource from "../models/RemoteContractSource.model";
import LocalContractSource from "../models/LocalContractSource.model";
import ContractSourceType from "./types/contractSource";
import { GraphQLJSONObject } from "graphql-type-json";
import { tryCompile } from "../../contour/deployer/compile";
import ProjectVersion from "../models/ProjectVersion.model";
import { TemplateType } from "./types/template";

const ContractSourceQueries = {
  remoteContractSource: {
    type: ContractSourceType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const source = await RemoteContractSource.findByPk(args.id);
      if (source.user_id !== ctx.state?.user?.id) {
        return null;
      }
      return source;
    },
  },
  localContractSource: {
    type: ContractSourceType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const source = await LocalContractSource.findByPk(args.id);
      if (source.user_id !== ctx.state?.user?.id) {
        return null;
      }
      return source;
    },
  },
  myContractSources: {
    type: new GraphQLNonNull(
      new GraphQLList(new GraphQLNonNull(ContractSourceType))
    ),
    args: {},
    resolve: async (parent, args, ctx, info) => {
      const userId = ctx.state?.user?.id;
      if (!userId) {
        return [];
      }
      const localSources = await LocalContractSource.findAll({
        where: {
          user_id: userId,
        },
      });
      const remoteSources = await RemoteContractSource.findAll({
        where: {
          user_id: userId,
        },
      });
      return [...localSources, ...remoteSources];
    },
  },
};

const ContractSourceMutations = {
  createFromS3File: {
    type: ContractSourceType,
    args: {
      key: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await LocalContractSource.importFromS3(
        args.key,
        ctx.state.user.id
      );
    },
  },
  tryCompileSource: {
    type: GraphQLJSONObject,
    args: {
      source: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await tryCompile(args.source);
    },
  },
  importContract: {
    type: ContractSourceType,
    args: {
      address: {
        type: new GraphQLNonNull(GraphQLString),
      },
      chainId: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      userId: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await RemoteContractSource.importByAddressAndChain(
        args.address,
        args.chainId,
        args.userId
      );
    },
  },
  createFromTemplate: {
    type: ContractSourceType,
    args: {
      userId: {
        type: new GraphQLNonNull(GraphQLString),
      },
      template: {
        type: new GraphQLNonNull(TemplateType),
      },
      params: {
        type: GraphQLJSONObject,
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await RemoteContractSource.createFromTemplate(
        args.template,
        args.params,
        args.userId
      );
    },
  },
  compileFromSource: {
    type: ContractSourceType,
    args: {
      source: {
        type: new GraphQLNonNull(GraphQLString),
      },
      versionId: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const match = args.source.match(/contract +([a-zA-Z0-9]+) *{/);
      const version = await ProjectVersion.findByPk(args.versionId);
      if (!version) {
        return null;
      }
      if (!(ctx.state?.user?.id && match[1])) {
        return null;
      }
      const newSource = await RemoteContractSource.compileFromSource(
        ctx.state.user.id,
        args.source,
        match[1]
      );
      version.data = {
        ...version.data,
        remote_sources: {
          ...version.data.remote_sources,
          [newSource.name]: newSource.id,
        },
      };
      await version.save();
      return newSource;
    },
  },
};

export { ContractSourceQueries, ContractSourceMutations };
