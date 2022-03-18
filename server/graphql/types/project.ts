import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import GraphQLJSONObject from "graphql-type-json";
import GithubRepoType from "./githubRepo";
import ProjectVersionType from "./projectVersion";

const ProjectType = new GraphQLObjectType({
  name: "Project",
  description: "A project",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The uuid of this project",
    },
    data: {
      type: GraphQLJSONObject,
    },
    user_id: {
      type: GraphQLString,
      description: "The id of the project's user",
    },
    node: {
      type: GraphQLJSONObject,
      resolve: async (parent, args, ctx, info) => {
        const node = await parent.$get("node");
        return node.data;
      },
    },
    versions: {
      type: new GraphQLList(new GraphQLNonNull(ProjectVersionType)),
      resolve: async (parent, args, ctx, info) => {
        return await parent.$get("versions");
      },
    },
    github_repo: {
      type: GithubRepoType,
      resolve: async (parent, args, ctx, info) => {
        return await parent.$get("github_repo");
      },
    },
  },
});

export default ProjectType;
