import 'react-native-gesture-handler'
import React, { useContext } from 'react'
// import { StatusBar } from 'expo-status-bar'
// import { StyleSheet, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import './i18n'
import AuthUserContextProvider, { AuthUserContext } from 'contexts/Auth'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  UnauthStackParamList,
  AuthDefaultTabParamList,
  AuthDrawerParamList
} from 'types/props'
import { Ionicons } from '@expo/vector-icons'
import HomeScreen from 'screens/Home'
import NotificationsScreen from 'screens/Notifications'
import ProfileScreen from 'screens/user/Profile'
import SettingsScreen from 'screens/user/Settings'
import SignInScreen from 'screens/auth/SignIn'
import SignUpScreen from 'screens/auth/SignUp'
import ConfirmAccountScreen from 'screens/auth/ConfirmAccount'
import ResetPasswordScreen from 'screens/auth/ResetPassword'
import { TFunction } from 'i18next'

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center'
//   }
// })

const UnauthStack = createStackNavigator<UnauthStackParamList>()
const AuthDrawer = createDrawerNavigator<AuthDrawerParamList>()
const AuthDefaultTab = createBottomTabNavigator<AuthDefaultTabParamList>()

const AuthDefaultTabs = (t: TFunction) => (
  <AuthDefaultTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = ''
        if (route.name === 'Home') {
          iconName = 'ios-home'
        } else if (route.name === 'Notifications') {
          iconName = focused ? 'ios-notifications' : 'ios-notifications-outline'
        }
        return <Ionicons name={iconName} size={size} color={color} />
      }
    })}
    tabBarOptions={{
      activeTintColor: 'red',
      inactiveTintColor: 'gray'
    }}
  >
    <AuthDefaultTab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        title: t('screen.home.title')
      }}
    />
    <AuthDefaultTab.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{
        title: t('screen.notifications.title'),
        tabBarBadge: 3
      }}
    />
  </AuthDefaultTab.Navigator>
)

const App: React.FC = () => {
  const { t } = useTranslation()
  const { user: authUser } = useContext(AuthUserContext)
  console.log(authUser)
  const isSignedIn = true
  return (
    <AuthUserContextProvider>
      <NavigationContainer>
        {isSignedIn ? (
          <AuthDrawer.Navigator initialRouteName="Default">
            <AuthDrawer.Screen
              name="Default"
              component={() => AuthDefaultTabs(t)}
            />
            <AuthDrawer.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                title: t('screen.profile.title')
              }}
            />
            <AuthDrawer.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                title: t('screen.settings.title')
              }}
            />
          </AuthDrawer.Navigator>
        ) : (
          <UnauthStack.Navigator>
            <UnauthStack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: t('screen.signIn.title')
              }}
            />
            <UnauthStack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{
                title: t('screen.signUp.title')
              }}
            />
            <UnauthStack.Screen
              name="ConfirmAccount"
              component={ConfirmAccountScreen}
              options={{
                title: t('screen.confirmAccount.title')
              }}
            />
            <UnauthStack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
              options={{
                title: t('screen.resetPassword.title')
              }}
            />
          </UnauthStack.Navigator>
        )}
      </NavigationContainer>
    </AuthUserContextProvider>
  )
}

export default App
