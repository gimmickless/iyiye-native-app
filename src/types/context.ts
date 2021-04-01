export type AuthUserAddressKey =
  | 'address1'
  | 'address2'
  | 'address3'
  | 'address4'
  | 'address5'
  | undefined

export type AuthUserState = {
  loaded: boolean
  props:
    | {
        fullName: string
        username: string
        email: string
        address: AuthUserAddressKey
        birthDate: string
        phoneNumber?: string
        picture?: string
        locale?: string
        theme?: string
        bio?: string
        contactable?: boolean
        address1?: AuthUserAddress
        address2?: AuthUserAddress
        address3?: AuthUserAddress
        address4?: AuthUserAddress
        address5?: AuthUserAddress
      }
    | undefined
}

export type AuthUserAddress = {
  kind: 'home' | 'office' | 'other'
  isDefault?: boolean
  latitude: number
  longitude: number
  directions: string
  routeAddress: string
  streetNumber: string
  flatNumber: number
  floor: number
}

export type UpdateAddressesInput = {
  address1?: AuthUserAddress
  address2?: AuthUserAddress
  address3?: AuthUserAddress
  address4?: AuthUserAddress
  address5?: AuthUserAddress
}

export type InAppNotificationType = {
  type: 'success' | 'info' | 'warn' | 'error'
  message: string
}
