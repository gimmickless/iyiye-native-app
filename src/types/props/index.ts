export type RootStackParamList = {
  SignIn: undefined
  SignUp: undefined
  ConfirmAccount: undefined
  ResetPassword: undefined
  Home: undefined
  Profile: { userId: string }
  Settings: { userId: string }
  Feed: { sort: 'latest' | 'top' } | undefined
}
