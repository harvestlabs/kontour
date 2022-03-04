import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import Contract, { ContractTemplate } from "../models/Contract.model";
import ContractType from "./types/contract";

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
  createContract: {
    type: ContractType,
    args: {
      address: {
        type: new GraphQLNonNull(GraphQLString),
      },
      chainId: {
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await Contract.createWithABI(args.address, args.chainId);
    },
  },
  createFromTemplate: {
    type: ContractType,
    args: {
      chainId: {
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await Contract.createFromTemplate(
        ContractTemplate.SIMPLE_STORAGE,
        [{ name: "test", type: "uint256" }],
        args.chainId
      );
    },
  },
};

export { ContractQueries, ContractMutations };
