import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import GraphQLJSONObject from "graphql-type-json";
import LocalContractSource from "../../models/LocalContractSource.model";
import RemoteContractSource from "../../models/RemoteContractSource.model";
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
        let local = [],
          remote = [];
        if (
          parent.data?.local_source_ids?.length != null &&
          parent.data?.local_source_ids?.length > 0
        ) {
          local = await LocalContractSource.findAll({
            where: {
              id: parent.data.local_source_ids,
            },
          });
        }
        if (
          parent.data?.remote_source_ids?.length != null &&
          parent.data?.remote_source_ids?.length > 0
        ) {
          remote = await RemoteContractSource.findAll({
            where: {
              id: parent.data.remote_source_ids,
            },
          });
        }
        return local.concat(remote);
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
