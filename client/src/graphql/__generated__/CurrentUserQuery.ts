/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CurrentUserQuery
// ====================================================

export interface CurrentUserQuery_currentUser_profile {
  __typename: "Profile";
  image_url: string | null;
  github_handle: string | null;
}

export interface CurrentUserQuery_currentUser {
  __typename: "User";
  /**
   * The uuid of this user
   */
  id: string;
  /**
   * The user's profile
   */
  profile: CurrentUserQuery_currentUser_profile | null;
}

export interface CurrentUserQuery {
  /**
   * The current logged in user
   */
  currentUser: CurrentUserQuery_currentUser | null;
}
