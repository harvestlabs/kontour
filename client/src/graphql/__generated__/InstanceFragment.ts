/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: InstanceFragment
// ====================================================

export interface InstanceFragment_contracts_contractSource {
  __typename: "ContractSource";
  id: string;
  name: string;
  functions: any;
  constructor: any | null;
  abi: any | null;
  events: any;
  source_type: number | null;
}

export interface InstanceFragment_contracts {
  __typename: "Contract";
  id: string;
  address: string;
  contractSource: InstanceFragment_contracts_contractSource;
}

export interface InstanceFragment_global_contracts_contractSource {
  __typename: "ContractSource";
  id: string;
  name: string;
  functions: any;
  constructor: any | null;
  abi: any | null;
  events: any;
  source_type: number | null;
}

export interface InstanceFragment_global_contracts {
  __typename: "Contract";
  id: string;
  address: string;
  contractSource: InstanceFragment_global_contracts_contractSource;
}

export interface InstanceFragment {
  __typename: "Instance";
  /**
   * The uuid of this instance
   */
  id: string;
  /**
   * The name of the instance
   */
  name: string | null;
  status: number;
  data: any | null;
  /**
   * The id of the project this instance belongs to
   */
  project_id: string;
  /**
   * The id of the project version this instance branched off of
   */
  project_version_id: string;
  contracts: InstanceFragment_contracts[];
  global_contracts: InstanceFragment_global_contracts[];
}
