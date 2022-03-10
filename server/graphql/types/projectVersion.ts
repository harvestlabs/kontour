import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import GraphQLJSONObject from "graphql-type-json";

const ProjectVersionType = new GraphQLObjectType({
  name: "ProjectVersion",
  description: "A version for a project",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The uuid of this project",
    },
    name: {
      type: GraphQLString,
      description: "The name of the version",
    },
    data: {
      type: GraphQLJSONObject,
    },
    project_id: {
      type: GraphQLString,
      description: "The id of the project this version belongs to",
    },
    status: {
      type: GraphQLInt,
      description: "The ProjectVersionStatus of this version",
    },
  },
});

export default ProjectVersionType;
