/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddRepo
// ====================================================

export interface AddRepo_addRepo {
  __typename: "GithubRepo";
  id: string;
}

export interface AddRepo {
  addRepo: AddRepo_addRepo | null;
}

export interface AddRepoVariables {
  repo_name: string;
  handle: string;
}
