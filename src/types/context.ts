export type AuthUserState = {
  loaded: boolean
  props?: {
    fullName: string
    username: string
    email: string
    address: AuthUserAddress
    birthDate: string
    phoneNumber?: string
    picture?: string
    locale?: string
    theme?: string
    bio?: string
    contactable?: boolean
    altAddress1?: AuthUserAddress
    altAddress2?: AuthUserAddress
    altAddress3?: AuthUserAddress
    altAddress4?: AuthUserAddress
    altAddress5?: AuthUserAddress
  }
}

export type AuthUserAddress = {
  kind: 'current' | 'home' | 'office' | 'other'
  name: string
  line1: string
  building: string
  flat: string
  country: string
  state: string
  cityregion: string
  zip: string
  latitude: string
  longitude: string
}
