import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import Profile from "../models/Profile.model";
import User from "../models/User.model";
import UserType from "./types/user";
import ApiKey from "../models/ApiKey.model";
import NodeAccountType from "./types/nodeAccount";
import NodeAccount from "../models/NodeAccount.model";
import Node from "../models/Node.model";
import Instance from "../models/Instance.model";

const UserQueries = {
  user: {
    type: UserType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await User.findByPk(args.id);
    },
  },
  currentUser: {
    type: UserType,
    description: "The current logged in user",
    resolve: (parent, args, ctx, info) => {
      return ctx.state.user;
    },
  },
  nodeAccounts: {
    type: new GraphQLNonNull(
      new GraphQLList(new GraphQLNonNull(NodeAccountType))
    ),
    args: {
      nodeId: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const userId = ctx.state?.user?.id;
      if (!userId) {
        return [];
      }
      return await NodeAccount.getAll(userId, args.nodeId);
    },
  },
};

const UserMutations = {
  editUserProfile: {
    type: UserType,
    args: {
      imageUrl: {
        type: GraphQLString,
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const user: User = await User.findByPk(ctx.state.user?.id, {
        include: [{ model: Profile }],
      });
      if (args.imageUrl) {
        user.profile.image_url = args.imageUrl;
      }

      user.profile.save();
      return user;
    },
  },
  requestAirdrop: {
    type: new GraphQLNonNull(GraphQLBoolean),
    description: "Requests an airdrop by signing a message",
    args: {
      key: {
        type: new GraphQLNonNull(GraphQLString),
      },
      instanceId: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const instance = await Instance.findByPk(args.instanceId);
      const nodeId = await instance.getNodeId();
      const result = await Node.airdropAddress(nodeId, args.key, 1);
      return Boolean(result);
    },
  },
  requestApiKey: {
    type: GraphQLString,
    resolve: async (parent, args, ctx, info) => {
      if (!ctx.state?.user?.id) {
        return null;
      }
      const apiKey = await ApiKey.getOrCreateForUser(ctx.state.user.id);
      return apiKey.key;
    },
  },
  requestNodeAccount: {
    type: NodeAccountType,
    args: {
      nodeId: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const userId = ctx.state?.user?.id;
      if (!userId) {
        return [];
      }
      return await NodeAccount.generateNew(userId, args.nodeId);
    },
  },
};

export { UserType, UserQueries, UserMutations };
