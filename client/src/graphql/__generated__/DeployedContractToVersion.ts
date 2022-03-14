/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeployedContractToVersion
// ====================================================

export interface DeployedContractToVersion_deployedContractToVersion {
  __typename: "Contract";
  id: string;
}

export interface DeployedContractToVersion {
  deployedContractToVersion: DeployedContractToVersion_deployedContractToVersion | null;
}

export interface DeployedContractToVersionVariables {
  sourceId: string;
  sourceType: number;
  versionId: string;
  address: string;
  params: any;
}
