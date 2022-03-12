/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Contract
// ====================================================

export interface Contract_contract_contractSource {
  __typename: "ContractSource";
  name: string;
  source: string;
  abi: any | null;
  chain_id: number | null;
  functions: any;
  events: any;
  constructor: any | null;
}

export interface Contract_contract {
  __typename: "Contract";
  id: string;
  address: string;
  contractSource: Contract_contract_contractSource;
  node: any | null;
}

export interface Contract {
  contract: Contract_contract | null;
}

export interface ContractVariables {
  address: string;
}
