/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProjectVersionsList
// ====================================================

export interface ProjectVersionsList_project_versions {
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

export interface ProjectVersionsList_project {
  __typename: "Project";
  /**
   * The uuid of this project
   */
  id: string;
  versions: ProjectVersionsList_project_versions[] | null;
}

export interface ProjectVersionsList {
  project: ProjectVersionsList_project | null;
}

export interface ProjectVersionsListVariables {
  project_id: string;
}
