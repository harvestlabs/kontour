import { GraphQLObjectType, GraphQLString } from "graphql";
import GraphQLJSON from "graphql-type-json";

const NodeAccountType = new GraphQLObjectType({
  name: "NodeAccount",
  description:
    "An eth address and private key generated on a single node for a user",
  fields: {
    data: {
      type: GraphQLJSON,
    },
    node_id: {
      type: GraphQLString,
    },
    user_id: {
      type: GraphQLString,
    },
  },
});

export default NodeAccountType;
