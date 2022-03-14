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
import ProjectVersion, {
  ProjectVersionStatus,
} from "../models/ProjectVersion.model";
import InstanceType from "./types/instance";

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
    type: ProjectVersionType,
    resolve: async (parent, args, ctx, info) => {
      const versionCreated = await Project.createProjectWithDefaultVersion({
        project_metadata: {},
        version_metadata: {},
        user_id: ctx.state?.user?.id,
      });
      return versionCreated;
    },
  },
  createDraftVersion: {
    type: ProjectVersionType,
    args: {
      projectId: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const project = await Project.findByPk(args.projectId);
      console.log("finding project", project, args.projectId);
      if (project.user_id !== ctx.state?.user?.id) {
        return null;
      }
      const newVersion = await ProjectVersion.create({
        data: {},
        status: ProjectVersionStatus.DRAFT,
        name: "New Draft",
        project_id: project.id,
      });
      await newVersion.createBlankHeadInstance();
      return newVersion;
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
      if (project.user_id !== ctx.state?.user?.id) {
        return null;
      }
      project.data = {
        ...project.data,
        ...args.data,
      };
      return await project.save();
    },
  },
  cloneSandbox: {
    type: InstanceType,
    args: {
      projectVersionId: {
        type: new GraphQLNonNull(GraphQLString),
      },
      name: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const version = await ProjectVersion.findByPk(args.projectVersionId, {
        include: Project,
      });
      if (version.project.user_id !== ctx.state?.user?.id) {
        return null;
      }
      return await version.createSandboxInstance();
    },
  },
};

export { ProjectQueries, ProjectMutations };
