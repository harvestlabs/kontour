/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProjectsQuery
// ====================================================

export interface ProjectsQuery_projects {
  __typename: "Project";
  /**
   * The uuid of this project
   */
  id: string;
}

export interface ProjectsQuery {
  projects: (ProjectsQuery_projects | null)[] | null;
}
