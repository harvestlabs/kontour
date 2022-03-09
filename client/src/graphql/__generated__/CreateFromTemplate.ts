/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Template } from "./../../../globalTypes.d";

// ====================================================
// GraphQL mutation operation: CreateFromTemplate
// ====================================================

export interface CreateFromTemplate_createFromTemplate {
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

export interface CreateFromTemplate {
  createFromTemplate: CreateFromTemplate_createFromTemplate | null;
}

export interface CreateFromTemplateVariables {
  projectId: string;
  template: Template;
  params: any;
}
