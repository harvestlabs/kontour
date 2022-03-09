/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ContractReadQuery
// ====================================================

export interface ContractReadQuery_contract {
  __typename: "Contract";
  id: string;
  address: string;
  functions: any;
  events: any;
  constructor: any | null;
}

export interface ContractReadQuery {
  contract: ContractReadQuery_contract | null;
}

export interface ContractReadQueryVariables {
  address: string;
}
