export type UnauthStackParamList = {
  SignIn: undefined
  SignUp: undefined
  ConfirmAccount: undefined
  ResetPassword: undefined
}

export type AuthDefaultTabParamList = {
  Home: undefined
  Notifications: undefined
  Feed: { sort: 'latest' | 'top' } | undefined
}

export type AuthDrawerParamList = {
  Default: undefined
  Profile: { userId: string }
  Settings: { userId: string }
}
