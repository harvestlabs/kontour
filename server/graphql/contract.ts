import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import Contract, { templateMapping } from "../models/Contract.model";
import ContractSource from "../models/ContractSource.model";
import S3ContractSource from "../models/S3ContractSource.model";
import ContractType from "./types/contract";
import { TemplateType } from "./types/template";

const ContractQueries = {
  contract: {
    type: ContractType,
    args: {
      address: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await Contract.findOne({ where: { address: args.address } });
    },
  },
  contractsForProject: {
    type: new GraphQLList(ContractType),

    args: {
      limit: {
        type: GraphQLInt,
      },
      order: {
        type: GraphQLString,
      },
      project_id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },

    resolve: async (parent, args, ctx, info) => {
      const params = {
        limit: args.limit,
        order: args.order,
      };
      if (args.user_id) {
        params["where"] = {
          user_id: args.user_id,
        };
      }
      return await Project.findAll(params);
    },
  },  }
};

const ContractMutations = {
  importContract: {
    type: ContractType,
    args: {
      address: {
        type: new GraphQLNonNull(GraphQLString),
      },
      chainId: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      projectId: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await Contract.importByAddressAndChain(
        args.address,
        args.chainId,
        args.projectId
      );
    },
  },
  createFromTemplate: {
    type: ContractType,
    args: {
      projectId: {
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
      return await Contract.createFromTemplate(
        args.template,
        args.params,
        args.projectId
      );
    },
  },
  getSourceForTemplate: {
    type: GraphQLString,
    args: {
      chainId: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      template: {
        type: new GraphQLNonNull(TemplateType),
      },
      params: {
        type: GraphQLJSONObject,
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const toDeploy = new templateMapping[args.template](args.params);
      return toDeploy.write();
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
      return await ContractSource.tryCompile(args.source);
    },
  },
  compileAndDeployFromSource: {
    type: ContractType,
    args: {
      source: {
        type: new GraphQLNonNull(GraphQLString),
      },
      projectId: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const match = args.source.match(/contract +([a-zA-Z0-9]+) *{/);
      return await Contract.createFromSourceString(
        args.source,
        match[1],
        args.projectId
      );
    },
  },
  deployFromS3Source: {
    type: ContractType,
    args: {
      sourceId: {
        type: new GraphQLNonNull(GraphQLString),
      },
      projectId: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const source = await S3ContractSource.findByPk(args.sourceId);
      if (source.user_id && source.user_id !== ctx.state.user.id) {
        return null;
      }
      return await Contract.importFromS3Source(source, args.projectId);
    },
  },
};

export { ContractQueries, ContractMutations };
