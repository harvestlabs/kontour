/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: InstancesSelectorQuery
// ====================================================

export interface InstancesSelectorQuery_instancesForProjectVersion {
  __typename: "Instance";
  /**
   * The uuid of this instance
   */
  id: string;
  /**
   * The name of the instance
   */
  name: string | null;
}

export interface InstancesSelectorQuery {
  instancesForProjectVersion: InstancesSelectorQuery_instancesForProjectVersion[];
}

export interface InstancesSelectorQueryVariables {
  version_id: string;
}
