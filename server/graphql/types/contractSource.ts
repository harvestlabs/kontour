import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";
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
    source: {
      type: new GraphQLNonNull(GraphQLString),
    },
    abi: {
      type: GraphQLJSON,
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (parent, args, ctx, info) => {
        return parent.constructor.name;
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
