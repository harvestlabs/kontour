import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import Project from "../models/Project.model";
import Node from "../models/Node.model";
import ProjectType from "./types/project";

const ProjectQueries = {
  project: {
    type: ProjectType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await Project.findByPk(args.id);
    },
  },
};

const ProjectMutations = {
  createProject: {
    type: ProjectType,
    resolve: async (parent, args, ctx, info) => {
      const node = await Node.getAvailable();
      return await Project.create({
        data: {},
        user_id: ctx.state?.user?.id,
        node_id: node.id,
      });
    },
  },
  updateProject: {
    type: ProjectType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
      data: {
        type: GraphQLJSONObject,
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const project = await Project.findByPk(args.id);
      project.data = {
        ...project.data,
        ...args.data,
      };
      return await project.save();
    },
  },
};

export { ProjectQueries, ProjectMutations };
