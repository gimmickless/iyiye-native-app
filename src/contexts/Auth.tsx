import React, { useReducer } from 'react'
import Auth from '@aws-amplify/auth'
import { AuthUserState } from 'types/context'

type CreateAuthUserInput = {
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

type UpdateAuthUserInput = {
  fullName: string
  address: string
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

type LoginInput = {
  usernameOrEmail: string
  password: string
}

type UpdateInput = {
  fullName: string
  address: string
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
        loaded: true,
        props: undefined
      }
    default:
      return state
  }
}

export default ({ children }: any) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

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
          contactable: !!attributes['custom:contactable'],
          altAddress1: attributes['custom:altAddress1'],
          altAddress2: attributes['custom:altAddress2'],
          altAddress3: attributes['custom:altAddress3'],
          altAddress4: attributes['custom:altAddress4'],
          altAddress5: attributes['custom:altAddress5']
        }
      })
    } catch (err) {
      console.log(`error ocurred: ${err}`)
    }
  }

  const update = async (payload: UpdateInput) => {
    try {
      let cognitoUser = await Auth.currentAuthenticatedUser()

      await Auth.updateUserAttributes(cognitoUser, {
        name: payload.fullName,
        address: payload.address,
        phone_number: payload.phoneNumber,
        picture: payload.picture,
        locale: payload.locale,
        'custom:theme': payload.theme,
        'custom:bio': payload.bio,
        'custom:contactable': payload.contactable,
        'custom:altAddress1': payload.altAddress1,
        'custom:altAddress2': payload.altAddress2,
        'custom:altAddress3': payload.altAddress3,
        'custom:altAddress4': payload.altAddress4,
        'custom:altAddress5': payload.altAddress5
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
      console.log(`error ocurred: ${err}`)
    }
  }

  const logout = async () => {
    try {
      await Auth.signOut()
      dispatch({ type: 'remove_auth_user' })
    } catch (err) {
      console.log(`error ocurred: ${err}`)
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
