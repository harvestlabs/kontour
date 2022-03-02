import { GraphQLObjectType, GraphQLString } from "graphql";

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
  },
});

export default ProfileType;
