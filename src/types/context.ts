export type AuthUserState = {
  loaded: boolean
  props?: {
    fullName: string
    username: string
    email: string
    address: string
    birthDate: string
    phoneNumber?: string
    picture?: string
    locale?: string
  }
}
