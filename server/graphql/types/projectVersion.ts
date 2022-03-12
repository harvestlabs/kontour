import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import GraphQLJSONObject from "graphql-type-json";
import S3ContractSource from "../../models/S3ContractSource.model";
import ContractSourceType from "./contractSource";

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
    contract_sources: {
      type: new GraphQLList(new GraphQLNonNull(ContractSourceType)),
      description: "The contract sources for project version",
      resolve: async (parent, args, ctx, info) => {
        console.log("hello", parent.data);
        if (
          parent.data?.contract_source_ids?.length != null &&
          parent.data?.contract_source_ids?.length > 0
        ) {
          const a = await Promise.all(
            parent.data?.contract_source_ids?.map(
              async (contract_source_id: string) => {
                const contract = await S3ContractSource.findByPk(
                  contract_source_id
                );
                return contract;
              }
            )
          );
          console.log("jellj", a);
          return a;
        } else {
          return [];
        }
      },
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
