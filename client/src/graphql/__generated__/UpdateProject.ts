/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateProject
// ====================================================

export interface UpdateProject_updateProject {
  __typename: "Project";
  /**
   * The uuid of this project
   */
  id: string;
  data: any | null;
}

export interface UpdateProject {
  updateProject: UpdateProject_updateProject | null;
}

export interface UpdateProjectVariables {
  id: string;
  data: any;
}
