import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";
import RemoteContractSource from "../../models/RemoteContractSource.model";
import { ContractSourceType as SourceType } from "../../models/Contract.model";
import ContractSourceType from "./contractSource";
import LocalContractSource from "../../models/LocalContractSource.model";

const ContractType = new GraphQLObjectType({
  name: "Contract",
  description: "The profile attached to a user",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    address: {
      type: new GraphQLNonNull(GraphQLString),
    },
    node: {
      type: GraphQLJSONObject,
      resolve: async (parent, args, ctx, info) => {
        const node = await parent.$get("node");
        return node.data;
      },
    },
    contractSource: {
      type: new GraphQLNonNull(ContractSourceType),
      resolve: async (parent, args, ctx, info) => {
        let model: any = RemoteContractSource;
        switch (parent.contract_source_type) {
          case SourceType.LOCAL:
            model = LocalContractSource;
            break;
          case SourceType.REMOTE:
            model = RemoteContractSource;
            break;
          default:
            break;
        }
        return await model.findOne({
          where: {
            id: parent.contract_source_id,
          },
        });
      },
    },
    constructor_params: {
      type: GraphQLJSON,
    },
  },
});

export default ContractType;
