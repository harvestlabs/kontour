/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RequestAirdropMutation
// ====================================================

export interface RequestAirdropMutation {
  /**
   * Requests an airdrop by signing a message
   */
  requestAirdrop: boolean;
}

export interface RequestAirdropMutationVariables {
  address: string;
  node_id: string;
}
