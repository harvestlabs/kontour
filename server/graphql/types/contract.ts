import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";
import ContractSource from "../../models/ContractSource.model";
import { ContractSourceType as SourceType } from "../../models/Contract.model";
import ContractSourceType from "./contractSource";
import S3ContractSource from "../../models/S3ContractSource.model";

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
        let model: any = ContractSource;
        switch (parent.contract_source_type) {
          case SourceType.S3_IMPORT:
            model = S3ContractSource;
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
  },
});

export default ContractType;
