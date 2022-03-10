import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import nacl from "tweetnacl";
import Base58 from "base-58";
import Profile from "../models/Profile.model";
import User from "../models/User.model";
import UserType from "./types/user";
import { local } from "../utils/web3";
import ApiKey from "../models/ApiKey.model";

const AIRDROP = "Airdrop Me!";

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
      projectId: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const { web3, account } = await local(args.projectId);
      const transaction = {
        from: account.address,
        to: args.key,
        value: web3.utils.toWei("1", "ether"),
      };
      const signed = await web3.eth.accounts.signTransaction(
        {
          from: account.address,
          to: args.key,
          value: web3.utils.toWei("1", "ether"),
          gas: await web3.eth.estimateGas(transaction),
          gasPrice: await web3.eth.getGasPrice(),
        },
        account.privateKey
      );
      const result = await web3.eth.sendSignedTransaction(
        signed.rawTransaction
      );
      return Boolean(result);
    },
  },
  requestApiKey: {
    type: GraphQLString,
    resolve: async (parent, args, ctx, info) => {
      if (!ctx.state?.user?.id) {
        return null;
      }
      const user = await User.findByPk(ctx.state.user.id, {
        include: [ApiKey],
      });
      if (user.api_key) {
        return user.api_key.key;
      }
      const apiKey = await ApiKey.create({
        user_id: user.id,
      });
      return apiKey.key;
    },
  },
};

export { UserType, UserQueries, UserMutations };
