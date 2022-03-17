/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: InteractableContractFragment
// ====================================================

export interface InteractableContractFragment_contractSource {
  __typename: "ContractSource";
  id: string;
  name: string;
  functions: any;
  constructor: any | null;
  abi: any | null;
  events: any;
  source_type: number | null;
}

export interface InteractableContractFragment {
  __typename: "Contract";
  id: string;
  address: string;
  contractSource: InteractableContractFragment_contractSource;
}
