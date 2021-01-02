import React from 'react'
import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import { ConfirmAccount, ResetPassword, SignIn, SignUp } from 'screens/auth'

type AuthStackParamList = {
  SignIn: undefined
  SignUp: undefined
  ConfirmAccount: undefined
  ResetPassword: undefined
}

const AuthStack = createStackNavigator<AuthStackParamList>()

const AuthStackScreen = (t: TFunction) => (
  <AuthStack.Navigator
    initialRouteName="SignIn"
    screenOptions={{
      headerShown: false
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
      name="ResetPassword"
      component={ResetPassword}
      options={{
        title: t('screen.resetPassword.title')
      }}
    />
  </AuthStack.Navigator>
)

export default AuthStackScreen
