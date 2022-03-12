/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ContractWriteQuery
// ====================================================

export interface ContractWriteQuery_contract_contractSource {
  __typename: "ContractSource";
  name: string;
  source: string;
  abi: any | null;
  chain_id: number | null;
  functions: any;
  events: any;
  constructor: any | null;
}

export interface ContractWriteQuery_contract {
  __typename: "Contract";
  id: string;
  address: string;
  contractSource: ContractWriteQuery_contract_contractSource;
  node: any | null;
}

export interface ContractWriteQuery {
  contract: ContractWriteQuery_contract | null;
}

export interface ContractWriteQueryVariables {
  address: string;
}
