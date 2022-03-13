/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ImportContract
// ====================================================

export interface ImportContract_importContract {
  __typename: "ContractSource";
  name: string;
  source: string;
  abi: any | null;
  chain_id: number | null;
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
  userId: string;
}
