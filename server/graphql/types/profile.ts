import { GraphQLObjectType, GraphQLString } from "graphql";
import LoginData from "../../models/LoginData.model";

const ProfileType = new GraphQLObjectType({
  name: "Profile",
  description: "The profile attached to a user",
  fields: {
    twitter_handle: {
      type: GraphQLString,
    },
    image_url: {
      type: GraphQLString,
    },
    user_id: {
      type: GraphQLString,
    },
    github_handle: {
      type: GraphQLString,
      resolve: async (parent, args, ctx, info) => {
        const loginData = await LoginData.findByPk(parent.user_id);
        return loginData.github_handle;
      },
    },
  },
});

export default ProfileType;
