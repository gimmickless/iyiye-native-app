/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createInAppNotification = /* GraphQL */ `
  mutation CreateInAppNotification($input: CreateInAppNotificationInput!) {
    createInAppNotification(input: $input) {
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
export const updateInAppNotificationsForUserAsRead = /* GraphQL */ `
  mutation UpdateInAppNotificationsForUserAsRead(
    $input: UpdateInAppNotificationsForUserAsReadInput!
  ) {
    updateInAppNotificationsForUserAsRead(input: $input) {
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
