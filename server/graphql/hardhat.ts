import { GraphQLNonNull, GraphQLString } from "graphql";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";
import redis from "../utils/redis";

const HARDHAT_MESSAGE_KEY = "hardhat";

const HardhatSubscriptions = {
  subscribeToLogs: {
    type: GraphQLJSONObject,
    args: {
      from: {
        type: GraphQLString,
      },
      to: {
        type: GraphQLString,
      },
    },
    resolve: async (payload, args, ctx, _) => {
      /*
          payload is { message, from, to }
          ctx is {userId: 'something'}
          */
      if (
        payload.from &&
        args.from &&
        payload.from.toLowerCase() === args.from.toLowerCase()
      ) {
        return payload;
      }
      if (
        payload.to &&
        args.to &&
        payload.to.toLowerCase() === args.to.toLowerCase()
      ) {
        return payload;
      }
    },
    subscribe: (_, args) => redis.pubsub.asyncIterator(HARDHAT_MESSAGE_KEY),
  },
};

export { HardhatSubscriptions };
