/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: VersionDeployedContractListItem
// ====================================================

export interface VersionDeployedContractListItem_contractSource {
  __typename: "ContractSource";
  id: string;
  name: string;
  functions: any;
  constructor: any | null;
  abi: any | null;
  events: any;
}

export interface VersionDeployedContractListItem {
  __typename: "Contract";
  id: string;
  address: string;
  contractSource: VersionDeployedContractListItem_contractSource;
}
