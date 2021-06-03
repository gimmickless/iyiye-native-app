const googleMapsEndpoint = 'https://maps.googleapis.com/'

// Limitations
export const passwordRegex =
  /^(?=.*\d)(?=.*[.!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/i
export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
export const usernameRegex = /^[A-Z0-9]+$/i
// export const usernameOrEmailRegex = new RegExp(
//   [usernameRegex, emailRegex].map((r) => r.source).join('|')
// )
export const forgotPasswordConfirmationCodeRegex = /[\S]/i
export const usernameMinLength = 3
export const usernameMaxLength = 32
export const emailMinLength = 3
export const emailMaxLength = 320
export const passwordMinLength = 3
export const passwordMaxLength = 320
export const nameMinLength = 1
export const nameMaxLength = 50
export const maxNumOfSearchResults = 3
export const commentMinLength = 3
export const commentMaxLength = 255

export const maxAddressCount = 5

// AWS, Amplify
export const cognitoNotAuthenticatedMessageList = [
  'The user is not authenticated',
  'not authenticated'
]
export const cognitoNoCurrentUserMessage = 'No current user'
export const defaultLoadItemLimit = 10

// Async Storage
export const globalAsyncStorageKeyPrefix = '@gimmickless:iyiye'

// Styles
export const homeHeaderHeight = 120
export const headerLeftContainerPaddingLeft = 10
export const headerRightButtonTextFont = 16
export const listItemPrimaryFontSize = 22
export const listItemSecondaryFontSize = 18

export const getHyperlinkTextColor = (isDark: boolean): string => {
  return isDark ? 'lightblue' : 'blue'
}

// Place
export const locationDelta = 0.0025

// Storage
export const getUserAvatarUrl = (
  cognitoIdentityId: string,
  username: string
): string => {
  if (!cognitoIdentityId || !username) {
    throw new Error(
      'cognitoIdentityId and username both required for inferring the profile pic URL'
    )
  }
  return `https://${process.env.REACT_APP_S3_USER_STORAGE_BUCKET}.s3-${process.env.REACT_APP_AWS_REGION}.amazonaws.com/protected/avatar/${cognitoIdentityId}/${username}`
}

// API
export const googleMapsAddressComponentStreetNumberType = 'street_number'
export const googlePlacesAutocompleteBaseUrl = new URL(
  '/maps/api/place/autocomplete/json',
  googleMapsEndpoint
)
export const googlePlaceDetailsBaseUrl = new URL(
  '/maps/api/place/details/json',
  googleMapsEndpoint
)
export const googlePlaceGeocodingBaseUrl = new URL(
  '/maps/api/geocode/json',
  googleMapsEndpoint
)
