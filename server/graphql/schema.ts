import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { UserQueries, UserMutations } from "./user";
import { ProjectQueries, ProjectMutations } from "./project";
import { ContractQueries, ContractMutations } from "./contract";
import {
  ContractSourceQueries,
  ContractSourceMutations,
} from "./contractSource";

const rootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: Object.assign(
    UserQueries,
    ContractQueries,
    ProjectQueries,
    ContractSourceQueries
  ),
});
const rootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: Object.assign(
    UserMutations,
    ContractMutations,
    ProjectMutations,
    ContractSourceMutations
  ),
});

let schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
  //   subscription: new GraphQLObjectType({
  //     name: "RootSubscription",
  //     fields: Object.assign(BoardSubscriptions),
  //   }),
});

// const checkAuth = async (resolve, root, args, ctx, info) => {
//   if (!ctx.state.user) {
//     return null;
//   }
//   const result = await resolve(root, args, ctx, info);
//   return result;
// };

// schema = applyMiddleware(schema, checkAuth);

export default schema;
