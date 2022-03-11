/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProjectEditorNavbarFragment
// ====================================================

export interface ProjectEditorNavbarFragment_versions {
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

export interface ProjectEditorNavbarFragment {
  __typename: "Project";
  versions: ProjectEditorNavbarFragment_versions[] | null;
}
