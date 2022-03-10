/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProjectEditorFragment
// ====================================================

export interface ProjectEditorFragment_versions {
  __typename: "ProjectVersion";
  /**
   * The uuid of this project
   */
  id: string;
  /**
   * The name of the version
   */
  name: string | null;
}

export interface ProjectEditorFragment {
  __typename: "Project";
  versions: (ProjectEditorFragment_versions | null)[] | null;
}
