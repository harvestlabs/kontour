/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ImportContract
// ====================================================

export interface ImportContract_importContract {
  __typename: "Contract";
  id: string;
  address: string;
  name: string;
  source: string;
  abi: any | null;
  chain_id: number;
  node: any | null;
  functions: any;
  events: any;
  constructor: any | null;
}

export interface ImportContract {
  importContract: ImportContract_importContract | null;
}

export interface ImportContractVariables {
  address: string;
  chainId: number;
  projectId: string;
}
