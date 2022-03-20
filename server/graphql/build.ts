import { GraphQLNonNull, GraphQLString } from "graphql";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";
import redis from "../utils/redis";

const BUILD_MESSAGE_KEY = "build_task";

const BuildSubscriptions = {
  subscribeToBuild: {
    type: GraphQLJSONObject,
    args: {
      buildId: {
        type: GraphQLString,
      },
    },
    resolve: async (payload, args, ctx, _) => {
      if (payload.buildId == args.buildId) {
        return payload;
      }
    },
    subscribe: (_, args) => redis.pubsub.asyncIterator(BUILD_MESSAGE_KEY),
  },
};

export { BuildSubscriptions };
