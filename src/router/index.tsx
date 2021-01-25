import React, { useContext } from 'react'
import { useColorScheme } from 'react-native-appearance'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DefaultTheme, DarkTheme } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import {
  AuthStackScreen,
  HomeStackScreen,
  NotificationStackScreen,
  ProfileStackScreen,
  SearchStackScreen
} from './stacks'
import { LocalizationContext } from 'contexts/Localization'
import { TabNames } from 'types/route'

const Tab = createBottomTabNavigator()

export const RootNavigator = () => {
  const { t } = useContext(LocalizationContext)
  const scheme = useColorScheme()
  //TODO: Get isSignedIn value from AuthContext
  const isSignedIn = false

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        initialRouteName={TabNames.Home}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName
            if (route.name === TabNames.Home) {
              iconName = focused ? 'home' : 'home-outline'
            } else if (route.name === TabNames.Search) {
              iconName = 'magnify'
            } else if (route.name === TabNames.Notification) {
              iconName = focused ? 'bell' : 'bell-outline'
            } else if (route.name === TabNames.Profile) {
              iconName = focused ? 'account' : 'account-outline'
            } else if (route.name === TabNames.Auth) {
              iconName = 'login-variant'
            }
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            )
          }
        })}
        tabBarOptions={{
          activeTintColor: 'red',
          inactiveTintColor: 'gray',
          keyboardHidesTabBar: true,
          showLabel: false,
          style: {
            elevation: 0,
            shadowOpacity: 0
          }
        }}
        backBehavior="history"
      >
        <Tab.Screen name={TabNames.Home}>{() => HomeStackScreen()}</Tab.Screen>
        <Tab.Screen name={TabNames.Search}>
          {() => SearchStackScreen()}
        </Tab.Screen>
        <Tab.Screen name={TabNames.Notification}>
          {() => NotificationStackScreen()}
        </Tab.Screen>
        {isSignedIn ? (
          <Tab.Screen name={TabNames.Profile}>
            {() => ProfileStackScreen()}
          </Tab.Screen>
        ) : (
          <Tab.Screen name={TabNames.Auth}>
            {() => AuthStackScreen(t)}
          </Tab.Screen>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  )
}
