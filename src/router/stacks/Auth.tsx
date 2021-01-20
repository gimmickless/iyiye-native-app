import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ConfirmAccount, ForgotPassword, SignIn, SignUp } from 'screens/auth'

export type AuthStackParamList = {
  SignIn: undefined
  SignUp: undefined
  ConfirmAccount: { email: string }
  ForgotPassword: undefined
}

const AuthStack = createStackNavigator<AuthStackParamList>()

const AuthStackScreen = (t: Function) => (
  <AuthStack.Navigator
    initialRouteName="SignIn"
    screenOptions={{
      // headerTintColor: 'ghostwhite',
      headerStyle: {
        // backgroundColor: 'transparent',
        opacity: 0.6,
        elevation: 0,
        shadowOpacity: 0
      }
    }}
  >
    <AuthStack.Screen
      name="SignIn"
      component={SignIn}
      options={{
        title: t('screen.signIn.title')
      }}
    />
    <AuthStack.Screen
      name="SignUp"
      component={SignUp}
      options={{
        title: t('screen.signUp.title')
      }}
    />
    <AuthStack.Screen
      name="ConfirmAccount"
      component={ConfirmAccount}
      options={{
        title: t('screen.confirmAccount.title')
      }}
    />
    <AuthStack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{
        title: t('screen.forgotPassword.title')
      }}
    />
  </AuthStack.Navigator>
)

export default AuthStackScreen
