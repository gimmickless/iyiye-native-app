import 'react-native-gesture-handler'
import React, { useContext } from 'react'
// import { StatusBar } from 'expo-status-bar'
import { AppearanceProvider } from 'react-native-appearance'

import { RootNavigator } from 'router'
import './i18n'

import AuthUserContextProvider, { AuthUserContext } from 'contexts/Auth'

const App: React.FC = () => {
  const { state: authUser } = useContext(AuthUserContext)
  console.log(authUser)

  return (
    <AuthUserContextProvider>
      <AppearanceProvider>
        <RootNavigator />
      </AppearanceProvider>
    </AuthUserContextProvider>
  )
}

export default App
