import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GraphQLUpload } from "graphql-upload";
import ContractSource from "../models/ContractSource.model";
import S3ContractSource from "../models/S3ContractSource.model";
import ContractSourceType from "./types/contractSource";

const ContractSourceQueries = {
  contractSource: {
    type: ContractSourceType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await ContractSource.findByPk(args.id);
    },
  },
  s3ContractSource: {
    type: ContractSourceType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await S3ContractSource.findByPk(args.id);
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
      const s3Sources = await S3ContractSource.findAll({
        where: {
          user_id: userId,
        },
      });
      const sources = await ContractSource.findAll({
        where: {
          user_id: userId,
        },
      });
      return [...s3Sources, ...sources];
    },
  },
};

const ContractSourceMutations = {
  createFromTruffleJSON: {
    type: ContractSourceType,
    args: {
      truffleJSON: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await S3ContractSource.uploadToS3(
        ctx.state.user.id,
        JSON.parse(args.truffleJSON)
      );
    },
  },
  createFromS3File: {
    type: ContractSourceType,
    args: {
      key: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await S3ContractSource.importFromS3(args.key, ctx.state.user.id);
    },
  },
  ingestFromQuikdraw: {
    type: ContractSourceType,
    args: {
      file: {
        type: GraphQLUpload,
      },
    },
    resolve: async (parent, args, ctx, info) => {},
  },
};

export { ContractSourceQueries, ContractSourceMutations };
