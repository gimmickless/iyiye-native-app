import React, { Dispatch, useReducer } from 'react'
import Auth from '@aws-amplify/auth'

type AuthUserState = {
  loaded: boolean
  user?: {
    firstName: string
    lastName: string
    username: string
    email: string
    address: string
    birthDate: string
    phoneNumber?: string
    picture?: string
    locale?: string
    zoneInfo?: string
  }
}

type CreateAuthUserInput = {
  firstName: string
  lastName: string
  username: string
  email: string
  address: string
  birthDate: string
  phoneNumber?: string
  picture?: string
  locale?: string
  zoneInfo?: string
}

type UpdateAuthUserInput = {
  firstName: string
  lastName: string
  address: string
  phoneNumber?: string
  picture?: string
  locale?: string
  zoneInfo?: string
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
    login: Dispatch<AuthReducerAction>
    update: Dispatch<AuthReducerAction>
    logout: Dispatch<AuthReducerAction>
  }
}>({
  state: initialState,
  action: {
    login: () => null,
    update: () => null,
    logout: () => null
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
        user: action.payload
      }
    case 'update_auth_user':
      return {
        loaded: true,
        user: {
          ...state.user,
          ...action.payload
        }
      } as AuthUserState
    case 'remove_auth_user':
      return {
        loaded: true,
        user: undefined
      }
    default:
      return state
  }
}

export default ({ children }: any) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = () => {
    return async (payload: { usernameOrEmail: string; password: string }) => {
      try {
        const { username, attributes } = await Auth.signIn(
          payload.usernameOrEmail,
          payload.password
        )
        dispatch({
          type: 'add_auth_user',
          payload: {
            username,
            firstName: attributes.name,
            lastName: attributes.family_name,
            email: attributes.email,
            address: attributes.address,
            birthDate: attributes.birthdate,
            phoneNumber: attributes.phone_number,
            picture: attributes.picture,
            locale: attributes.locale,
            zoneInfo: attributes.zoneinfo
          } as CreateAuthUserInput
        })
      } catch (err) {
        console.log(`error ocurred: ${err}`)
      }
    }
  }

  const update = () => {
    return async (payload: {
      firstName: string
      lastName: string
      address: string
      phoneNumber?: string
      picture?: string
      locale?: string
      zoneInfo?: string
    }) => {
      try {
        let cognitoUser = await Auth.currentAuthenticatedUser()

        await Auth.updateUserAttributes(cognitoUser, {
          name: payload.firstName,
          family_name: payload.lastName,
          address: payload.address,
          phone_number: payload.phoneNumber,
          picture: payload.picture,
          locale: payload.locale,
          zoneinfo: payload.zoneInfo
        })
        dispatch({
          type: 'update_auth_user',
          payload: {
            firstName: payload.firstName,
            lastName: payload.lastName,
            address: payload.address,
            phoneNumber: payload.phoneNumber,
            picture: payload.picture,
            locale: payload.locale,
            zoneInfo: payload.zoneInfo
          } as UpdateAuthUserInput
        })
      } catch (err) {
        console.log(`error ocurred: ${err}`)
      }
    }
  }

  const logout = () => {
    return async () => {
      try {
        await Auth.signOut()
        dispatch({ type: 'remove_auth_user' })
      } catch (err) {
        console.log(`error ocurred: ${err}`)
      }
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
