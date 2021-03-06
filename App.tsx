import 'react-native-gesture-handler'
import React from 'react'
import { enableScreens } from 'react-native-screens'
import i18n from 'i18n-js'
import { AppearanceProvider, useColorScheme } from 'react-native-appearance'
import Amplify from '@aws-amplify/core'
import API from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub'
import AuthUserContextProvider from 'contexts/Auth'
import LocalizationContextProvider from 'contexts/Localization'
import InAppNotificationContextProvider from 'contexts/InAppNotification'
import InAppNotificationBox from 'components/shared/InAppNotificationBox'
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
Amplify.configure(AwsConfig)
API.configure(AwsConfig)
PubSub.configure(AwsConfig)

const App: React.FC = () => {
  return (
    <AppearanceProvider>
      <StatusBar style="auto" />
      <InAppNotificationContextProvider>
        <AuthUserContextProvider>
          <LocalizationContextProvider>
            <RootNavigator />
          </LocalizationContextProvider>
        </AuthUserContextProvider>
        <InAppNotificationBox />
      </InAppNotificationContextProvider>
    </AppearanceProvider>
  )
}

export default App
