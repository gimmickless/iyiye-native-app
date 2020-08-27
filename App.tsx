import 'react-native-gesture-handler'
import React, { useContext } from 'react'
// import { StatusBar } from 'expo-status-bar'
// import { StyleSheet, Text, View } from 'react-native'
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
  const { user: authUser } = useContext(AuthUserContext)
  return (
    <AuthUserContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {isSignedIn ? (
            <React.Fragment>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{
                  title: 'Sign In'
                }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                  title: 'Sign Up'
                }}
              />
              <Stack.Screen
                name="ConfirmAccount"
                component={ConfirmAccountScreen}
                options={{
                  title: 'Confirm Account'
                }}
              />
              <Stack.Screen
                name="ResetPassword"
                component={ResetPasswordScreen}
                options={{
                  title: 'Reset Password'
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
