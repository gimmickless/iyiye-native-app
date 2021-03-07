import { GoogleConfig } from 'config'

// Limitations
export const passwordRegex = /^(?=.*\d)(?=.*[.!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/i
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

// Async Storage
export const globalAsyncStorageKeyPrefix = '@gimmickless:iyiye'

// Styles
export const homeHeaderHeight = 120
export const headerLeftContainerPaddingLeft = 10
export const headerRightButtonTextFont = 16
export const listItemFontSize = 22

export const getHyperlinkTextColor = (isDark: boolean) => {
  return isDark ? 'lightblue' : 'blue'
}

// API
export const googlePlacesAutocompleteBaseUrl = new URL(
  `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GoogleConfig.Places.apiKey}`
)
