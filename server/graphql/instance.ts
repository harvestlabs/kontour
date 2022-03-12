import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import InstanceType from "./types/instance";
import ProjectVersion, {
  ProjectVersionStatus,
} from "../models/ProjectVersion.model";
import Instance, { InstanceStatus } from "../models/Instance.model";

const InstanceQueries = {
  instance: {
    type: InstanceType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await Instance.findByPk(args.id);
    },
  },
  instancesForProjectVersion: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(InstanceType))),
    args: {
      projectVersionId: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const version = await ProjectVersion.findByPk(args.projectVersionId);
      return await version.$get("instances");
    },
  },
};

const InstanceMutations = {
  createInstanceFromVersion: {
    type: InstanceType,
    args: {
      projectVersionId: {
        type: new GraphQLNonNull(GraphQLString),
      },
      name: {
        type: GraphQLString,
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const version = await ProjectVersion.findByPk(args.projectVersionId);
      if (version.status !== ProjectVersionStatus.PUBLISHED) {
        return null;
      }
      return await Instance.create({
        project_id: version.project_id,
        project_version_id: version.id,
        data: {},
        status: InstanceStatus.HEAD,
        name: args.name || "Untitled",
      });
    },
  },
  updateInstance: {
    type: InstanceType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
      data: {
        type: GraphQLJSONObject,
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const instance = await Instance.findByPk(args.id);
      instance.data = {
        ...instance.data,
        ...args.data,
      };
      return await instance.save();
    },
  },
};

export { InstanceQueries, InstanceMutations };
