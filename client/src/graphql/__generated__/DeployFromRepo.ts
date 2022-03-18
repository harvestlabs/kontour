/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeployFromRepo
// ====================================================

export interface DeployFromRepo_deployFromRepo {
  __typename: "GithubRepo";
  id: string;
  deploy_status: number;
}

export interface DeployFromRepo {
  deployFromRepo: DeployFromRepo_deployFromRepo | null;
}

export interface DeployFromRepoVariables {
  id: string;
}
