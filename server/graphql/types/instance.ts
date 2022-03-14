import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import GraphQLJSONObject from "graphql-type-json";
import ContractType from "./contract";

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
    status: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    data: {
      type: GraphQLJSONObject,
    },
    project_id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The id of the project this instance belongs to",
    },
    project_version_id: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        "The id of the project version this instance branched off of",
    },
    contracts: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ContractType))
      ),
      resolve: async (parent, args, ctx, info) => {
        return await parent.$get("contracts");
      },
    },
  },
});

export default InstanceType;
