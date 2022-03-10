import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import GraphQLJSONObject from "graphql-type-json";

const InstanceType = new GraphQLObjectType({
  name: "Instance",
  description: "A working container for modification of the Contracts/API",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The uuid of this instance",
    },
    name: {
      type: GraphQLString,
      description: "The name of the instance",
    },
    data: {
      type: GraphQLJSONObject,
    },
    project_id: {
      type: GraphQLString,
      description: "The id of the project this instance belongs to",
    },
    project_version_id: {
      type: GraphQLString,
      description:
        "The id of the project version this instance branched off of",
    },
  },
});

export default InstanceType;
