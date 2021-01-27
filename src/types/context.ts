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
    homeAddress?: string
    officeAddress?: string
    otherAddress1?: string
    otherAddress2?: string
  }
}
