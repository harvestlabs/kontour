/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProjectButton
// ====================================================

export interface CreateProjectButton_createProject {
  __typename: "Project";
  /**
   * The uuid of this project
   */
  id: string;
}

export interface CreateProjectButton {
  createProject: CreateProjectButton_createProject | null;
}

export interface CreateProjectButtonVariables {
  name?: string | null;
}
