// Limitations
export const passwordRegex = /^(?=.*\d)(?=.*[.!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/i
export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
export const usernameRegex = /^[A-Z0-9]+$/i
export const usernameOrEmailRegex = new RegExp(
  `(${usernameRegex})|(${emailRegex})`
)
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

// Styles
export const headerLeftContainerPaddingLeft = 10

export const textColor = {
  screenBody: {
    title: 'dimgrey',
    subtitle: 'dimgrey'
  }
}
export const screenBodyTitleColor = 'dimgrey'
export const screenBodySubtitleColor = 'dimgrey'
export const pressableTextColor = 'blue'
export const errorTextColor = 'red'
