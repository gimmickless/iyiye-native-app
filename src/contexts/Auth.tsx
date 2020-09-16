import React, { Dispatch, useReducer } from 'react'
import Auth, { CognitoUser } from '@aws-amplify/auth'

type AuthUserState = {
  loaded: boolean
  user?: {
    firstName: string
    lastName: string
    username: string
    email: string
    address: string
    birthDate: string
    phone?: string
  }
}

type CreateAuthUserInput = {
  firstName: string
  lastName: string
  username: string
  email: string
  address: string
  birthDate: string
  phone?: string
}

type UpdateAuthUserInput = {
  firstName: string
  lastName: string
  address: string
  phone?: string
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
    return async (
      payload: { usernameOrEmail: string; password: string },
      callback: Function
    ) => {
      try {
        const user = (await Auth.signIn(
          payload.usernameOrEmail,
          payload.password
        )) as CognitoUser
        console.log('Signed in user data: ' + user)
        // let [cognitoAuthUser, cognitoCredentials] = await Promise.all([
        //   Auth.currentAuthenticatedUser(),
        //   Auth.currentCredentials()
        // ])
        dispatch({ type: 'add_auth_user', payload: {} as CreateAuthUserInput })
        callback()
      } catch (err) {}
    }
  }

  const update = () => {
    return async (
      payload: {
        firstName: string
        lastName: string
        address: string
        phone?: string
      },
      callback: Function
    ) => {
      try {
        // let [cognitoAuthUser, cognitoCredentials] = await Promise.all([
        //   Auth.currentAuthenticatedUser(),
        //   Auth.currentCredentials()
        // ])
        dispatch({
          type: 'update_auth_user',
          payload: {} as UpdateAuthUserInput
        })
        callback()
      } catch (err) {}
    }
  }

  const logout = () => {
    return async (payload: { id: string }, callback: Function) => {
      try {
        dispatch({ type: 'remove_auth_user' })
        callback()
      } catch (err) {}
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
