/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ContractQuery
// ====================================================

export interface ContractQuery_contract_contractSource {
  __typename: "ContractSource";
  name: string;
  source: string;
  abi: any | null;
  chain_id: number | null;
  functions: any;
  events: any;
  constructor: any | null;
}

export interface ContractQuery_contract {
  __typename: "Contract";
  id: string;
  address: string;
  contractSource: ContractQuery_contract_contractSource;
  node: any | null;
}

export interface ContractQuery {
  contract: ContractQuery_contract | null;
}

export interface ContractQueryVariables {
  address: string;
}
