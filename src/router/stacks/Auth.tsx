import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ConfirmAccount, ForgotPassword, SignIn, SignUp } from 'screens/auth'
import { LocalizationContext } from 'contexts/Localization'

export enum AuthStackScreenNames {
  SignIn = 'SignIn',
  SignUp = 'SignUp',
  ConfirmAccount = 'ConfirmAccount',
  ForgotPassword = 'ForgotPassword'
}

export type AuthStackParamList = {
  SignIn: undefined
  SignUp: undefined
  ConfirmAccount: { email: string; username: string }
  ForgotPassword: undefined
}

const AuthStack = createStackNavigator<AuthStackParamList>()

const AuthStackScreen: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  return (
    <AuthStack.Navigator
      initialRouteName={AuthStackScreenNames.SignIn}
      screenOptions={{
        headerStyle: {
          opacity: 0.6,
          elevation: 0,
          shadowOpacity: 0
        }
      }}
    >
      <AuthStack.Screen
        name={AuthStackScreenNames.SignIn}
        component={SignIn}
        options={{
          title: t('screen.auth.signIn.title')
        }}
      />
      <AuthStack.Screen
        name={AuthStackScreenNames.SignUp}
        component={SignUp}
        options={{
          title: t('screen.auth.signUp.title')
        }}
      />
      <AuthStack.Screen
        name={AuthStackScreenNames.ConfirmAccount}
        component={ConfirmAccount}
        options={{
          title: t('screen.auth.confirmAccount.title')
        }}
      />
      <AuthStack.Screen
        name={AuthStackScreenNames.ForgotPassword}
        component={ForgotPassword}
        options={{
          title: t('screen.auth.forgotPassword.title')
        }}
      />
    </AuthStack.Navigator>
  )
}

export default AuthStackScreen
