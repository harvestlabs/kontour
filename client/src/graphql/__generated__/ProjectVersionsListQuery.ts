/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProjectVersionsListQuery
// ====================================================

export interface ProjectVersionsListQuery_project_versions {
  __typename: "ProjectVersion";
  /**
   * The uuid of this project
   */
  id: string;
  /**
   * The name of the version
   */
  name: string | null;
}

export interface ProjectVersionsListQuery_project {
  __typename: "Project";
  /**
   * The uuid of this project
   */
  id: string;
  versions: ProjectVersionsListQuery_project_versions[] | null;
}

export interface ProjectVersionsListQuery {
  project: ProjectVersionsListQuery_project | null;
}

export interface ProjectVersionsListQueryVariables {
  project_id: string;
}
