import 'react-native-gesture-handler'
import React from 'react'
import { enableScreens } from 'react-native-screens'
import i18n from 'i18n-js'
import { AppearanceProvider } from 'react-native-appearance'
// import Core from '@aws-amplify/core'
import Auth from '@aws-amplify/auth'
import API from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub'
import AuthUserContextProvider from 'contexts/Auth'
import LocalizationContextProvider from 'contexts/Localization'
import InAppMessageContextProvider from 'contexts/InAppMessage'
import InAppMessageBox from 'components/shared/InAppMessageBox'
import { en } from 'locales'
import { RootNavigator } from 'router'
import { AwsConfig } from 'config'
import { StatusBar } from 'expo-status-bar'

// Screen optimization: https://reactnavigation.org/docs/react-native-screens
enableScreens()

// Localization
i18n.fallbacks = true
i18n.translations = { en }

// AWS Amplify configurations
// Core.configure(AwsConfig)
Auth.configure(AwsConfig)
API.configure(AwsConfig)
PubSub.configure(AwsConfig)

const App: React.FC = () => {
  return (
    <AppearanceProvider>
      <StatusBar style="auto" />
      <InAppMessageContextProvider>
        <AuthUserContextProvider>
          <LocalizationContextProvider>
            <RootNavigator />
          </LocalizationContextProvider>
        </AuthUserContextProvider>
        <InAppMessageBox />
      </InAppMessageContextProvider>
    </AppearanceProvider>
  )
}

export default App
