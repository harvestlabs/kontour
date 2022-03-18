/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateDeployParams
// ====================================================

export interface UpdateDeployParams_updateDeployParams {
  __typename: "GithubRepo";
  id: string;
}

export interface UpdateDeployParams {
  updateDeployParams: UpdateDeployParams_updateDeployParams | null;
}

export interface UpdateDeployParamsVariables {
  id: string;
  deploy_params: any;
}
