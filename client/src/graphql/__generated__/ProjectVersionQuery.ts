/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProjectVersionQuery
// ====================================================

export interface ProjectVersionQuery_projectVersion_contract_sources {
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

export interface ProjectVersionQuery_projectVersion_head_instance_contracts_contractSource {
  __typename: "ContractSource";
  id: string;
  name: string;
  functions: any;
  constructor: any | null;
  abi: any | null;
  events: any;
  source_type: number | null;
}

export interface ProjectVersionQuery_projectVersion_head_instance_contracts {
  __typename: "Contract";
  id: string;
  address: string;
  contractSource: ProjectVersionQuery_projectVersion_head_instance_contracts_contractSource;
  constructor_params: any | null;
}

export interface ProjectVersionQuery_projectVersion_head_instance_global_contracts_contractSource {
  __typename: "ContractSource";
  id: string;
  name: string;
  functions: any;
  constructor: any | null;
  abi: any | null;
  events: any;
  source_type: number | null;
}

export interface ProjectVersionQuery_projectVersion_head_instance_global_contracts {
  __typename: "Contract";
  id: string;
  address: string;
  contractSource: ProjectVersionQuery_projectVersion_head_instance_global_contracts_contractSource;
}

export interface ProjectVersionQuery_projectVersion_head_instance {
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
  contracts: ProjectVersionQuery_projectVersion_head_instance_contracts[];
  global_contracts: ProjectVersionQuery_projectVersion_head_instance_global_contracts[];
}

export interface ProjectVersionQuery_projectVersion {
  __typename: "ProjectVersion";
  /**
   * The name of the version
   */
  name: string | null;
  /**
   * The ProjectVersionStatus of this version
   */
  status: number | null;
  /**
   * The id of the project this version belongs to
   */
  project_id: string | null;
  /**
   * The id of the node this version belongs to
   */
  node_id: string | null;
  sdk_url: string | null;
  /**
   * The contract sources for project version
   */
  contract_sources: ProjectVersionQuery_projectVersion_contract_sources[] | null;
  /**
   * The head revision instance of this version
   */
  head_instance: ProjectVersionQuery_projectVersion_head_instance | null;
}

export interface ProjectVersionQuery {
  projectVersion: ProjectVersionQuery_projectVersion | null;
}

export interface ProjectVersionQueryVariables {
  version_id: string;
}
