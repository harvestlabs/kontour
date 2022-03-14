/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateDraftVersion
// ====================================================

export interface CreateDraftVersion_createDraftVersion {
  __typename: "ProjectVersion";
  /**
   * The uuid of this project
   */
  id: string;
}

export interface CreateDraftVersion {
  createDraftVersion: CreateDraftVersion_createDraftVersion | null;
}

export interface CreateDraftVersionVariables {
  project_id: string;
}
