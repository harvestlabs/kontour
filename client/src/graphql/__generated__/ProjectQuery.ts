/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProjectQuery
// ====================================================

export interface ProjectQuery_project_versions {
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

export interface ProjectQuery_project {
  __typename: "Project";
  /**
   * The uuid of this project
   */
  id: string;
  versions: ProjectQuery_project_versions[] | null;
}

export interface ProjectQuery {
  project: ProjectQuery_project | null;
}

export interface ProjectQueryVariables {
  project_id: string;
}
