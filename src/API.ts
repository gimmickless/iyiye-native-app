/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateInAppNotificationInput = {
  type?: InAppNotificationType | null,
  receiverUsername: string,
  body?: string | null,
};

// type KitCategory
// @aws_iam
// @aws_cognito_user_pools(cognito_groups: ["iyiye-default-ug"]) {
// name: ID!
// imageUrl: AWSURL
// }
// type Kit
// @aws_iam
// @aws_cognito_user_pools(cognito_groups: ["iyiye-default-ug"]) {
// id: ID!
// name: String!
// version: String!
// description: String
// authorUsername: ID
// author: User
// approved: Boolean
// cuisineCountryCode: String
// diets: String # Comma-separated list
// recipe: String!
// price: Float!
// calorie: Number
// prepTime: Number! # Minutes
// proposeTime: AWSTimestamp
// approverUsername: ID
// approveTime: AWSTimestamp
// lastUpdaterUsername: ID!
// lastUpdateTime: AWSTimestamp!
// }
// E N U M S
export enum InAppNotificationType {
  announcement = "announcement",
  promotion = "promotion",
  report = "report",
  comment = "comment",
  star = "star",
  flag = "flag",
}


export type UpdateInAppNotificationsForUserAsReadInput = {
  receiverUsername: string,
};

export type CreateInAppNotificationMutationVariables = {
  input: CreateInAppNotificationInput,
};

export type CreateInAppNotificationMutation = {
  createInAppNotification:  {
    __typename: "InAppNotification",
    id: string,
    type: InAppNotificationType | null,
    receiverUsername: string,
    body: string | null,
    isRead: boolean,
    createdTime: string,
    lastUpdatedTime: string,
  } | null,
};

export type UpdateInAppNotificationsForUserAsReadMutationVariables = {
  input: UpdateInAppNotificationsForUserAsReadInput,
};

export type UpdateInAppNotificationsForUserAsReadMutation = {
  updateInAppNotificationsForUserAsRead:  {
    __typename: "InAppNotification",
    id: string,
    type: InAppNotificationType | null,
    receiverUsername: string,
    body: string | null,
    isRead: boolean,
    createdTime: string,
    lastUpdatedTime: string,
  } | null,
};

export type GetUserBasicInfoQueryVariables = {
  username: string,
};

export type GetUserBasicInfoQuery = {
  getUserBasicInfo:  {
    __typename: "User",
    username: string,
    picture: string | null,
    bio: string | null,
    contactable: boolean | null,
  } | null,
};

export type ListInAppNotificationsForUserQueryVariables = {
  username: string,
  limit?: number | null,
  offset?: number | null,
};

export type ListInAppNotificationsForUserQuery = {
  listInAppNotificationsForUser:  Array< {
    __typename: "InAppNotification",
    id: string,
    type: InAppNotificationType | null,
    receiverUsername: string,
    body: string | null,
    isRead: boolean,
    createdTime: string,
    lastUpdatedTime: string,
  } | null > | null,
};

export type OnCreateInAppNotificationSubscription = {
  onCreateInAppNotification:  {
    __typename: "InAppNotification",
    id: string,
    type: InAppNotificationType | null,
    receiverUsername: string,
    body: string | null,
    isRead: boolean,
    createdTime: string,
    lastUpdatedTime: string,
  } | null,
};

export type OnUpdateInAppNotificationsForUserAsReadSubscription = {
  onUpdateInAppNotificationsForUserAsRead:  {
    __typename: "InAppNotification",
    id: string,
    type: InAppNotificationType | null,
    receiverUsername: string,
    body: string | null,
    isRead: boolean,
    createdTime: string,
    lastUpdatedTime: string,
  } | null,
};
