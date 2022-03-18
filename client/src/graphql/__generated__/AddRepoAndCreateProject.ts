/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddRepoAndCreateProject
// ====================================================

export interface AddRepoAndCreateProject_addRepoAndCreateProject_versions {
  __typename: "ProjectVersion";
  /**
   * The uuid of this project
   */
  id: string;
}

export interface AddRepoAndCreateProject_addRepoAndCreateProject {
  __typename: "Project";
  /**
   * The uuid of this project
   */
  id: string;
  versions: AddRepoAndCreateProject_addRepoAndCreateProject_versions[] | null;
}

export interface AddRepoAndCreateProject {
  addRepoAndCreateProject: AddRepoAndCreateProject_addRepoAndCreateProject | null;
}

export interface AddRepoAndCreateProjectVariables {
  repo_name: string;
  handle: string;
}
