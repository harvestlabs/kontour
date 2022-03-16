import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import GraphQLJSON from "graphql-type-json";

const GithubRepoType = new GraphQLObjectType({
  name: "GithubRepo",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    repo_name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    handle: {
      type: new GraphQLNonNull(GraphQLString),
    },
    deploy_status: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    deploy_data: {
      type: GraphQLJSON,
    },
    user_id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

export default GithubRepoType;
