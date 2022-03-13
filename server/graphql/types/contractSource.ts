import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";
import { ContractSourceType as ModelContractSourceType } from "../../models/Contract.model";
import { getConstructor, getEvents, getFunctions } from "../../utils/etherscan";

const ContractSourceType = new GraphQLObjectType({
  name: "ContractSource",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    chain_id: {
      type: GraphQLInt,
    },
    source: {
      type: new GraphQLNonNull(GraphQLString),
    },
    abi: {
      type: GraphQLJSON,
    },
    bytecode: {
      type: GraphQLString,
    },
    type: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (parent, args, ctx, info) => {
        return parent.constructor.name === "RemoteContractSource"
          ? ModelContractSourceType.REMOTE
          : ModelContractSourceType.LOCAL;
      },
    },
    functions: {
      type: new GraphQLNonNull(GraphQLJSON),
      resolve: (parent, args, ctx, info) => {
        return getFunctions(parent.abi);
      },
    },
    events: {
      type: new GraphQLNonNull(GraphQLJSON),
      resolve: (parent, args, ctx, info) => {
        return getEvents(parent.abi);
      },
    },
    constructor: {
      type: GraphQLJSON,
      resolve: (parent, args, ctx, info) => {
        return getConstructor(parent.abi);
      },
    },
  },
});

export default ContractSourceType;
