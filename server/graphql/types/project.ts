import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import GraphQLJSONObject from "graphql-type-json";

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
  },
});

export default ProjectType;
