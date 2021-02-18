import React, { useEffect, useReducer } from 'react'
import Auth from '@aws-amplify/auth'
import { AuthUserAddress, AuthUserState } from 'types/context'
import { cognitoNotAuthenticatedMessageList } from 'utils/constants'
import { useToast } from 'react-native-styled-toast'

type CreateAuthUserInput = {
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

type UpdateAuthUserInput = {
  fullName: string
  address: AuthUserAddress
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

type LoginInput = {
  usernameOrEmail: string
  password: string
}

type UpdateInput = {
  fullName: string
  address: AuthUserAddress
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
      type: 'remove_auth_user'
    }

const initialState = {
  loaded: false
}

export const AuthUserContext = React.createContext<{
  state: AuthUserState
  action: {
    login: (payload: LoginInput) => Promise<void>
    update: (payload: UpdateInput) => Promise<void>
    logout: () => Promise<void>
  }
}>({
  state: initialState,
  action: {
    login: () => Promise.resolve(),
    update: () => Promise.resolve(),
    logout: () => Promise.resolve()
  }
})

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
    case 'remove_auth_user':
      return {
        loaded: true
      }
    default:
      return state
  }
}

export default ({ children }: any) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const { toast } = useToast()

  useEffect(() => {
    ;(async () => {
      try {
        let currentAuthUser = await Auth.currentAuthenticatedUser()
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
            address: JSON.parse(
              currentAuthUserAttributes.address
            ) as AuthUserAddress,
            birthDate: currentAuthUserAttributes.birthdate,
            phoneNumber: currentAuthUserAttributes.phone_number,
            picture: currentAuthUserAttributes.picture,
            locale: currentAuthUserAttributes.locale,
            theme: currentAuthUserAttributes['custom:theme'],
            bio: currentAuthUserAttributes['custom:bio'],
            contactable: !!currentAuthUserAttributes['custom:contactable'],
            altAddress1: JSON.parse(
              currentAuthUserAttributes['custom:altAddress1']
            ) as AuthUserAddress,
            altAddress2: JSON.parse(
              currentAuthUserAttributes['custom:altAddress2']
            ) as AuthUserAddress,
            altAddress3: JSON.parse(
              currentAuthUserAttributes['custom:altAddress3']
            ) as AuthUserAddress,
            altAddress4: JSON.parse(
              currentAuthUserAttributes['custom:altAddress4']
            ) as AuthUserAddress,
            altAddress5: JSON.parse(
              currentAuthUserAttributes['custom:altAddress5']
            ) as AuthUserAddress
          }
        })
      } catch (err) {
        if (!cognitoNotAuthenticatedMessageList.includes(err.toString())) {
          toast({
            message: JSON.stringify(err),
            intent: 'ERROR',
            duration: 0
          })
        }
        dispatch({ type: 'remove_auth_user' })
      }
    })()
  }, [toast])

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
          address: JSON.parse(attributes.address) as AuthUserAddress,
          birthDate: attributes.birthdate,
          phoneNumber: attributes.phone_number,
          picture: attributes.picture,
          locale: attributes.locale,
          theme: attributes['custom:theme'],
          bio: attributes['custom:bio'],
          contactable: !!attributes['custom:contactable'],
          altAddress1: JSON.parse(
            attributes['custom:altAddress1']
          ) as AuthUserAddress,
          altAddress2: JSON.parse(
            attributes['custom:altAddress2']
          ) as AuthUserAddress,
          altAddress3: JSON.parse(
            attributes['custom:altAddress3']
          ) as AuthUserAddress,
          altAddress4: JSON.parse(
            attributes['custom:altAddress4']
          ) as AuthUserAddress,
          altAddress5: JSON.parse(
            attributes['custom:altAddress5']
          ) as AuthUserAddress
        }
      })
    } catch (err) {
      toast({
        message: JSON.stringify(err),
        intent: 'ERROR',
        duration: 0
      })
    }
  }

  const update = async (payload: UpdateInput) => {
    try {
      let cognitoUser = await Auth.currentAuthenticatedUser()

      await Auth.updateUserAttributes(cognitoUser, {
        name: payload.fullName,
        address: JSON.stringify(payload.address),
        phone_number: payload.phoneNumber,
        picture: payload.picture,
        locale: payload.locale,
        'custom:theme': payload.theme,
        'custom:bio': payload.bio,
        'custom:contactable': payload.contactable,
        'custom:altAddress1': JSON.stringify(payload.altAddress1),
        'custom:altAddress2': JSON.stringify(payload.altAddress2),
        'custom:altAddress3': JSON.stringify(payload.altAddress3),
        'custom:altAddress4': JSON.stringify(payload.altAddress4),
        'custom:altAddress5': JSON.stringify(payload.altAddress5)
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
          bio: payload.bio,
          contactable: payload.contactable,
          altAddress1: payload.altAddress1,
          altAddress2: payload.altAddress2,
          altAddress3: payload.altAddress3,
          altAddress4: payload.altAddress4,
          altAddress5: payload.altAddress5
        }
      })
    } catch (err) {
      toast({
        message: JSON.stringify(err),
        intent: 'ERROR',
        duration: 0
      })
    }
  }

  const logout = async () => {
    try {
      await Auth.signOut()
      dispatch({ type: 'remove_auth_user' })
    } catch (err) {
      toast({
        message: JSON.stringify(err),
        intent: 'ERROR',
        duration: 0
      })
    }
  }

  return (
    <AuthUserContext.Provider
      value={{ state, action: { login, update, logout } }}
    >
      {children}
    </AuthUserContext.Provider>
  )
}
