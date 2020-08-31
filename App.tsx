import 'react-native-gesture-handler'
import React, { useContext } from 'react'
// import { StatusBar } from 'expo-status-bar'
// import { StyleSheet, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import './i18n'
import AuthUserContextProvider, { AuthUserContext } from 'contexts/Auth'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { RootStackParamList } from 'types/props'
import HomeScreen from 'screens/Home'
import ProfileScreen from 'screens/user/Profile'
import SettingsScreen from 'screens/user/Settings'
import SignInScreen from 'screens/auth/SignIn'
import SignUpScreen from 'screens/auth/SignUp'
import ConfirmAccountScreen from 'screens/auth/ConfirmAccount'
import ResetPasswordScreen from 'screens/auth/ResetPassword'

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center'
//   }
// })

const Stack = createStackNavigator<RootStackParamList>()

const App: React.FC = () => {
  const { t } = useTranslation()
  const { user: authUser } = useContext(AuthUserContext)
  console.log(authUser)
  const isSignedIn = true
  return (
    <AuthUserContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {isSignedIn ? (
            <React.Fragment>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  title: t('screen.home.title')
                }}
              />
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                  title: t('screen.profile.title')
                }}
              />
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                  title: t('screen.settings.title')
                }}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{
                  title: t('screen.signIn.title')
                }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                  title: t('screen.signUp.title')
                }}
              />
              <Stack.Screen
                name="ConfirmAccount"
                component={ConfirmAccountScreen}
                options={{
                  title: t('screen.confirmAccount.title')
                }}
              />
              <Stack.Screen
                name="ResetPassword"
                component={ResetPasswordScreen}
                options={{
                  title: t('screen.resetPassword.title')
                }}
              />
            </React.Fragment>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthUserContextProvider>
  )
}

export default App
