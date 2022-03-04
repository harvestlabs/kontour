import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import GraphQLJSON from "graphql-type-json";
import { getConstructor, getEvents, getFunctions } from "../../utils/etherscan";

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
    chain_id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    abi: {
      type: GraphQLJSON,
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

export default ContractType;
