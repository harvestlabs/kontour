import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import ProfileType from "./profile";
import ProjectType from "./project";
import PublicKeyType from "./web3PublicKey";

const UserType = new GraphQLObjectType({
  name: "User",
  description: "A single user",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The uuid of this user",
    },
    profile: {
      type: ProfileType,
      description: "The user's profile",
      resolve: async (parent, args, ctx, info) => {
        return await parent.$get("profile");
      },
    },
    publicKey: {
      type: PublicKeyType,
      description: "The user's public key",
      resolve: async (parent, args, ctx, info) => {
        return await parent.$get("public_key");
      },
    },
    projects: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ProjectType))
      ),
      resolve: async (parent, args, ctx, info) => {
        return await parent.$get("projects");
      },
    },
  },
});

export default UserType;
