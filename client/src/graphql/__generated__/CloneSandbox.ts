/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CloneSandbox
// ====================================================

export interface CloneSandbox_cloneSandbox {
  __typename: "Instance";
  /**
   * The uuid of this instance
   */
  id: string;
}

export interface CloneSandbox {
  cloneSandbox: CloneSandbox_cloneSandbox | null;
}

export interface CloneSandboxVariables {
  projectVersionId: string;
  name: string;
}
