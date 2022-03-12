import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import Project from "../models/Project.model";
import Node from "../models/Node.model";
import ProjectType from "./types/project";
import ProjectVersionType from "./types/projectVersion";
import ProjectVersion from "../models/ProjectVersion.model";

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
  projectVersion: {
    type: ProjectVersionType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await ProjectVersion.findByPk(args.id);
    },
  },
  projects: {
    type: new GraphQLList(ProjectType),

    args: {
      limit: {
        type: GraphQLInt,
      },
      order: {
        type: GraphQLString,
      },
      user_id: {
        type: GraphQLString,
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const params = {
        limit: args.limit,
        order: args.order,
      };
      if (args.user_id) {
        params["where"] = {
          user_id: args.user_id,
        };
      }
      return await Project.findAll(params);
    },
  },
};

const ProjectMutations = {
  createProject: {
    type: ProjectType,
    resolve: async (parent, args, ctx, info) => {
      const node = await Node.getAvailable();

      return Project.createProjectWithDefaultVersion({
        project_metadata: {},
        version_metadata: {},
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
