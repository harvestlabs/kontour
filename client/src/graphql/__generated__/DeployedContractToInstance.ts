/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeployedContractToInstance
// ====================================================

export interface DeployedContractToInstance_deployedContractToInstance {
  __typename: "Contract";
  id: string;
}

export interface DeployedContractToInstance {
  deployedContractToInstance: DeployedContractToInstance_deployedContractToInstance | null;
}

export interface DeployedContractToInstanceVariables {
  sourceId: string;
  sourceType: number;
  instanceId: string;
  address: string;
  params: any;
}
