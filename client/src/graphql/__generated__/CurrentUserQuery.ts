/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CurrentUserQuery
// ====================================================

export interface CurrentUserQuery_currentUser {
  __typename: "User";
  /**
   * The uuid of this user
   */
  id: string;
}

export interface CurrentUserQuery {
  /**
   * The current logged in user
   */
  currentUser: CurrentUserQuery_currentUser | null;
}
