/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: VersionContractsListFragment
// ====================================================

export interface VersionContractsListFragment {
  __typename: "ContractSource";
  id: string;
  type: number;
  source_type: number | null;
  name: string;
  constructor: any | null;
  events: any;
  functions: any;
  bytecode: string | null;
  abi: any | null;
}
