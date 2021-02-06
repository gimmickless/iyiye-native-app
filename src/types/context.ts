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
    theme?: string
    bio?: string
    contactable?: boolean
    altAddress1?: string
    altAddress2?: string
    altAddress3?: string
    altAddress4?: string
    altAddress5?: string
  }
}
