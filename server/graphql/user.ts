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
      await user.createProfileIfNotExists();
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
    },
    resolve: async (parent, args, ctx, info) => {
      const transaction = {
        from: local.account.address,
        to: args.key,
        value: local.web3.utils.toWei("1", "ether"),
      };
      const signed = await local.web3.eth.accounts.signTransaction(
        {
          from: local.account.address,
          to: args.key,
          value: local.web3.utils.toWei("1", "ether"),
          gas: await local.web3.eth.estimateGas(transaction),
          gasPrice: await local.web3.eth.getGasPrice(),
        },
        local.account.privateKey
      );
      const result = await local.web3.eth.sendSignedTransaction(
        signed.rawTransaction
      );
      return Boolean(result);
    },
  },
};

export { UserType, UserQueries, UserMutations };
