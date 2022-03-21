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
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProjectType))),
    args: {
      limit: {
        type: GraphQLInt,
      },
      order: {
        type: GraphQLString,
      },
    },
    resolve: async (parent, args, ctx, info) => {
      if (!ctx.state?.user?.id) {
        return [];
      }
      return await Project.findAll({
        where: {
          user_id: ctx.state.user.id,
        },
        limit: args.limit,
        order: args.order,
      });
    },
  },
};

const ProjectMutations = {
  createProject: {
    type: ProjectType,
    args: {
      name: {
        type: GraphQLString,
      },
    },
    resolve: async (parent, args, ctx, info) => {
      if (!ctx.state?.user?.id) {
        throw new Error("Invalid user");
      }
      const { project, version } =
        await Project.createProjectWithDefaultVersion({
          project_metadata: {
            name: args.name,
          },
          version_metadata: {},
          user_id: ctx.state.user.id,
        });
      return project;
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
      if (project.user_id !== ctx.state?.user?.id) {
        throw new Error("Invalid user");
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
  createMainnetVersion: {
    type: ProjectVersionType,
    args: {
      projectVersionId: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const version = await ProjectVersion.findByPk(args.projectVersionId, {
        include: Project,
      });
      if (version.project.user_id !== ctx.state?.user?.id) {
        throw new Error("Invalid user");
      }
      const newVersion = await ProjectVersion.create({
        data: { ...version.data },
        status: ProjectVersionStatus.MAINNET,
        name: "Mainnet",
        project_id: version.project_id,
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
