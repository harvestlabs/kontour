import { GraphQLNonNull, GraphQLString } from "graphql";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";
import redis from "../utils/redis";

const HARDHAT_MESSAGE_KEY = "hardhat";

const HardhatSubscriptions = {
  subscribeToLogs: {
    type: GraphQLJSONObject,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (payload, args, ctx, _) => {
      /*
          payload is { message, from, to }
          ctx is {userId: 'something'}
          */
      if (
        payload.from &&
        payload.from.toLowerCase() === args.id.toLowerCase()
      ) {
        return payload;
      }
    },
    subscribe: (_, args) => redis.pubsub.asyncIterator(HARDHAT_MESSAGE_KEY),
  },
};

export { HardhatSubscriptions };
