import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";
import Contract, {
  ContractSourceType,
  templateMapping,
} from "../models/Contract.model";
import ContractSource from "../models/ContractSource.model";
import Instance from "../models/Instance.model";
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
      instanceId: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await Contract.importByAddressAndChain(
        args.address,
        args.chainId,
        args.instanceId
      );
    },
  },
  createFromTemplate: {
    type: ContractType,
    args: {
      instanceId: {
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
        args.instanceId
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
      instanceId: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const match = args.source.match(/contract +([a-zA-Z0-9]+) *{/);
      return await Contract.createFromSourceString(
        args.source,
        match[1],
        args.instanceId
      );
    },
  },
  deployedContractToInstance: {
    type: ContractType,
    args: {
      sourceId: {
        type: new GraphQLNonNull(GraphQLString),
      },
      instanceId: {
        type: new GraphQLNonNull(GraphQLString),
      },
      address: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const source = await ContractSource.findByPk(args.sourceId);
      const instance = await Instance.findByPk(args.instanceId);
      return await Contract.create({
        address: args.address,
        node_id: await instance.getNodeId(),
        contract_source_type: ContractSourceType.S3_IMPORT,
        contract_source_id: source.id,
      });
    },
  },
  deployFromS3Source: {
    type: ContractType,
    args: {
      sourceId: {
        type: new GraphQLNonNull(GraphQLString),
      },
      instanceId: {
        type: new GraphQLNonNull(GraphQLString),
      },
      params: {
        type: new GraphQLNonNull(GraphQLJSON),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const source = await S3ContractSource.findByPk(args.sourceId);
      if (source.user_id && source.user_id !== ctx.state.user.id) {
        return null;
      }
      return await Contract.importFromS3Source(
        source,
        args.instanceId,
        args.params
      );
    },
  },
};

export { ContractQueries, ContractMutations };
