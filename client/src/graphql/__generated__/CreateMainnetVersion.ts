/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateMainnetVersion
// ====================================================

export interface CreateMainnetVersion_createMainnetVersion {
  __typename: "ProjectVersion";
  /**
   * The uuid of this project
   */
  id: string;
}

export interface CreateMainnetVersion {
  createMainnetVersion: CreateMainnetVersion_createMainnetVersion | null;
}

export interface CreateMainnetVersionVariables {
  projectVersionId: string;
}
