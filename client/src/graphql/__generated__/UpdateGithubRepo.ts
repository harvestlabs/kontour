/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateGithubRepo
// ====================================================

export interface UpdateGithubRepo_createProject {
  __typename: "ProjectVersion";
  /**
   * The uuid of this project
   */
  id: string;
}

export interface UpdateGithubRepo {
  createProject: UpdateGithubRepo_createProject | null;
}

export interface UpdateGithubRepoVariables {
  name?: string | null;
}
