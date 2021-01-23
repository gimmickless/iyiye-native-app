import 'react-native-gesture-handler'
import React, { useContext } from 'react'
// import { StatusBar } from 'expo-status-bar'
import { enableScreens } from 'react-native-screens'
import i18n from 'i18n-js'
import { AppearanceProvider } from 'react-native-appearance'
import Amplify from '@aws-amplify/core'
import API from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub'
import { ToastProvider } from 'react-native-styled-toast'
import AuthUserContextProvider, { AuthUserContext } from 'contexts/Auth'
import LocalizationContextProvider from 'contexts/Localization'
import { en } from 'locales'
import { RootNavigator } from 'router'
import { AwsConfig } from 'config'

// Screen optimization: https://reactnavigation.org/docs/react-native-screens
enableScreens()

// Localization
i18n.fallbacks = true
i18n.translations = { en }

// AWS Amplify configurations
Amplify.configure(AwsConfig)
API.configure(AwsConfig)
PubSub.configure(AwsConfig)

const App: React.FC = () => {
  const { state: authUser } = useContext(AuthUserContext)
  console.log(authUser)

  return (
    <AppearanceProvider>
      <ToastProvider maxToasts={1} position="BOTTOM">
        <AuthUserContextProvider>
          <LocalizationContextProvider>
            <RootNavigator />
          </LocalizationContextProvider>
        </AuthUserContextProvider>
      </ToastProvider>
    </AppearanceProvider>
  )
}

export default App
