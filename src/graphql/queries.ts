/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserBasicInfo = /* GraphQL */ `
  query GetUserBasicInfo($username: String!) {
    getUserBasicInfo(username: $username) {
      username
      picture
      bio
      contactable
    }
  }
`;
export const listInAppNotificationsForUser = /* GraphQL */ `
  query ListInAppNotificationsForUser(
    $username: String!
    $limit: Int
    $offset: Int
  ) {
    listInAppNotificationsForUser(
      username: $username
      limit: $limit
      offset: $offset
    ) {
      id
      type
      receiverUsername
      body
      isRead
      createdTime
      lastUpdatedTime
    }
  }
`;
