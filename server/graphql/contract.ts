import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";
import Contract, { ContractSourceType } from "../models/Contract.model";
import RemoteContractSource, {
  templateMapping,
} from "../models/RemoteContractSource.model";
import Instance from "../models/Instance.model";
import ProjectVersion from "../models/ProjectVersion.model";
import LocalContractSource from "../models/LocalContractSource.model";
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
  deployedContractToVersion: {
    type: ContractType,
    args: {
      sourceId: {
        type: new GraphQLNonNull(GraphQLString),
      },
      sourceType: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      versionId: {
        type: new GraphQLNonNull(GraphQLString),
      },
      address: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const [source, version] = await Promise.all([
        args.sourceType === ContractSourceType.LOCAL
          ? LocalContractSource.findByPk(args.sourceId)
          : RemoteContractSource.findByPk(args.sourceId),
        ProjectVersion.findByPk(args.versionId),
      ]);
      const instance = await version.getHead();
      return await Contract.create({
        address: args.address,
        node_id: await instance.getNodeId(),
        contract_source_type: ContractSourceType.LOCAL,
        contract_source_id: source.id,
      });
    },
  },
  deployFromLocalSource: {
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
      const source = await LocalContractSource.findByPk(args.sourceId);
      if (source.user_id && source.user_id !== ctx.state.user.id) {
        return null;
      }
      return await Contract.importFromSource(
        source,
        ContractSourceType.LOCAL,
        args.instanceId,
        args.params
      );
    },
  },
};

export { ContractQueries, ContractMutations };
