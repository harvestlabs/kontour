/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Contract
// ====================================================

export interface Contract_contract {
  __typename: "Contract";
  id: string;
  address: string;
  abi: any | null;
}

export interface Contract {
  contract: Contract_contract | null;
}

export interface ContractVariables {
  address: string;
}
