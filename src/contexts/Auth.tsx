import React, { useContext, useEffect, useReducer } from 'react'
import Auth from '@aws-amplify/auth'
import {
  AuthUserAddressKey,
  AuthUserAddress,
  AuthUserState,
  UpdateAddressesInput
} from 'types/context'
import { cognitoNotAuthenticatedMessageList } from 'utils/constants'
import { useInAppNotification } from 'contexts/InAppNotification'
import { useColorScheme } from 'react-native-appearance'

type CreateAuthUserInput = {
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

type UpdateAuthUserInput = {
  fullName: string
  address: AuthUserAddressKey
  phoneNumber?: string
  picture?: string
  locale?: string
  theme?: string
  bio?: string
  contactable?: boolean
}

type UpdateAuthUserAddressesInput = {
  address1?: AuthUserAddress
  address2?: AuthUserAddress
  address3?: AuthUserAddress
  address4?: AuthUserAddress
  address5?: AuthUserAddress
}

type LoginInput = {
  usernameOrEmail: string
  password: string
}

type UpdateInput = {
  fullName: string
  address?: AuthUserAddressKey
  phoneNumber?: string
  picture?: string
  locale?: string
  theme?: string
  bio?: string
  contactable?: boolean
}

type AuthReducerAction =
  | {
      type: 'add_auth_user'
      payload: CreateAuthUserInput
    }
  | {
      type: 'update_auth_user'
      payload: UpdateAuthUserInput
    }
  | {
      type: 'update_auth_user_alt_addresses'
      payload: UpdateAuthUserAddressesInput
    }
  | {
      type: 'remove_auth_user'
    }

const initialState = {
  loaded: false,
  props: undefined
}

export const AuthUserContext = React.createContext<{
  state: AuthUserState
  action: {
    login: (payload: LoginInput) => Promise<void>
    update: (payload: UpdateInput) => Promise<void>
    updateAddresses: (payload: UpdateAddressesInput) => Promise<void>
    logout: () => Promise<void>
  }
}>({
  state: initialState,
  action: {
    login: () => Promise.resolve(),
    update: () => Promise.resolve(),
    updateAddresses: () => Promise.resolve(),
    logout: () => Promise.resolve()
  }
})

export const useAuthUser = () => {
  const { state: authUser } = useContext(AuthUserContext)
  return { authUser }
}

const authReducer = (
  state: AuthUserState,
  action: AuthReducerAction
): AuthUserState => {
  switch (action.type) {
    case 'add_auth_user':
      return {
        loaded: true,
        props: action.payload
      }
    case 'update_auth_user':
      return {
        loaded: true,
        props: {
          ...state.props,
          ...action.payload
        }
      } as AuthUserState
    case 'update_auth_user_alt_addresses':
      return {
        loaded: true,
        props: {
          ...state.props,
          ...action.payload
        }
      } as AuthUserState
    case 'remove_auth_user':
      return {
        loaded: true,
        props: undefined
      }
    default:
      return state
  }
}

export default ({ children }: any) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const { addNotification } = useInAppNotification()
  const scheme = useColorScheme()

  useEffect(() => {
    !(async () => {
      try {
        const [currentAuthUser] = await Promise.all([
          Auth.currentAuthenticatedUser(),
          Auth.currentSession() // this is deliberately called for refreshing tokens: https://docs.amplify.aws/lib/auth/manageusers/q/platform/js#retrieve-current-session
        ])
        if (!currentAuthUser) {
          dispatch({ type: 'remove_auth_user' })
          return
        }
        const { attributes: currentAuthUserAttributes } = currentAuthUser

        dispatch({
          type: 'add_auth_user',
          payload: {
            username: currentAuthUser.username,
            fullName: currentAuthUserAttributes.name,
            email: currentAuthUserAttributes.email,
            address: currentAuthUserAttributes.address,
            birthDate: currentAuthUserAttributes.birthdate,
            phoneNumber: currentAuthUserAttributes.phone_number,
            picture: currentAuthUserAttributes.picture,
            locale: currentAuthUserAttributes.locale,
            theme: currentAuthUserAttributes['custom:theme'],
            bio: currentAuthUserAttributes['custom:bio'],
            contactable:
              currentAuthUserAttributes['custom:contactable'] === 'true',
            address1: currentAuthUserAttributes['custom:address1']
              ? (JSON.parse(
                  currentAuthUserAttributes['custom:address1']
                ) as AuthUserAddress)
              : undefined,
            address2: currentAuthUserAttributes['custom:address2']
              ? (JSON.parse(
                  currentAuthUserAttributes['custom:address2']
                ) as AuthUserAddress)
              : undefined,
            address3: currentAuthUserAttributes['custom:address3']
              ? (JSON.parse(
                  currentAuthUserAttributes['custom:address3']
                ) as AuthUserAddress)
              : undefined,
            address4: currentAuthUserAttributes['custom:address4']
              ? (JSON.parse(
                  currentAuthUserAttributes['custom:address4']
                ) as AuthUserAddress)
              : undefined,
            address5: currentAuthUserAttributes['custom:address5']
              ? (JSON.parse(
                  currentAuthUserAttributes['custom:address5']
                ) as AuthUserAddress)
              : undefined
          }
        })
      } catch (err) {
        if (!cognitoNotAuthenticatedMessageList.includes(err.toString())) {
          addNotification({
            message: JSON.stringify(err),
            type: 'error'
          })
        }
        dispatch({ type: 'remove_auth_user' })
      }
    })()
  }, [addNotification])

  const login = async (payload: LoginInput) => {
    try {
      const { username, attributes } = await Auth.signIn(
        payload.usernameOrEmail,
        payload.password
      )
      dispatch({
        type: 'add_auth_user',
        payload: {
          username,
          fullName: attributes.name,
          email: attributes.email,
          address: attributes.address,
          birthDate: attributes.birthdate,
          phoneNumber: attributes.phone_number,
          picture: attributes.picture,
          locale: attributes.locale,
          theme: attributes['custom:theme'],
          bio: attributes['custom:bio'],
          contactable: attributes['custom:contactable'] === 'true',
          address1: attributes['custom:address1']
            ? (JSON.parse(attributes['custom:address1']) as AuthUserAddress)
            : undefined,
          address2: attributes['custom:address2']
            ? (JSON.parse(attributes['custom:address2']) as AuthUserAddress)
            : undefined,
          address3: attributes['custom:address3']
            ? (JSON.parse(attributes['custom:address3']) as AuthUserAddress)
            : undefined,
          address4: attributes['custom:address4']
            ? (JSON.parse(attributes['custom:address4']) as AuthUserAddress)
            : undefined,
          address5: attributes['custom:address5']
            ? (JSON.parse(attributes['custom:address5']) as AuthUserAddress)
            : undefined
        }
      })
    } catch (err) {
      addNotification({
        message: JSON.stringify(err),
        type: 'error'
      })
    }
  }

  const update = async (payload: UpdateInput) => {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser()

      await Auth.updateUserAttributes(cognitoUser, {
        name: payload.fullName,
        address: JSON.stringify(payload.address),
        phone_number: payload.phoneNumber,
        picture: payload.picture,
        locale: payload.locale,
        'custom:theme': payload.theme ?? scheme,
        'custom:bio': payload.bio ?? '',
        'custom:contactable': payload.contactable ? 'true' : 'false'
      })
      dispatch({
        type: 'update_auth_user',
        payload: {
          fullName: payload.fullName,
          address: payload.address,
          phoneNumber: payload.phoneNumber,
          picture: payload.picture,
          locale: payload.locale,
          theme: payload.theme,
          bio: payload.bio
        }
      })
    } catch (err) {
      addNotification({
        message: JSON.stringify(err),
        type: 'error'
      })
    }
  }

  const updateAddresses = async (payload: UpdateAddressesInput) => {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser()

      await Auth.updateUserAttributes(cognitoUser, {
        'custom:address1': payload.address1
          ? JSON.stringify(payload.address1)
          : '',
        'custom:address2': payload.address2
          ? JSON.stringify(payload.address2)
          : '',
        'custom:address3': payload.address3
          ? JSON.stringify(payload.address3)
          : '',
        'custom:address4': payload.address4
          ? JSON.stringify(payload.address4)
          : '',
        'custom:address5': payload.address5
          ? JSON.stringify(payload.address5)
          : ''
      })
      dispatch({
        type: 'update_auth_user_alt_addresses',
        payload: {
          address1: payload.address1,
          address2: payload.address2,
          address3: payload.address3,
          address4: payload.address4,
          address5: payload.address5
        }
      })
    } catch (err) {
      console.log(err)
      addNotification({
        message: JSON.stringify(err),
        type: 'error'
      })
    }
  }

  const logout = async () => {
    try {
      await Auth.signOut()
      dispatch({ type: 'remove_auth_user' })
    } catch (err) {
      addNotification({
        message: JSON.stringify(err),
        type: 'error'
      })
    }
  }

  return (
    <AuthUserContext.Provider
      value={{ state, action: { login, update, updateAddresses, logout } }}
    >
      {children}
    </AuthUserContext.Provider>
  )
}
