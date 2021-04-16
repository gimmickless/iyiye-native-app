import React, { useContext } from 'react'
import { useColorScheme } from 'react-native-appearance'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
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
import { useAuthUser } from 'contexts/Auth'
import {
  IyiyeNavigationLightTheme,
  IyiyeNavigationDarkTheme
} from 'utils/theme'
import { ThemeProvider as ReactNativeElementsThemeProvider } from 'react-native-elements'
import { TabBarBadgeContext } from 'contexts/TabBarBadge'

const Tab = createBottomTabNavigator()

export const RootNavigator = () => {
  const { t } = useContext(LocalizationContext)
  const { tabCount } = useContext(TabBarBadgeContext)
  const scheme = useColorScheme()
  const { authUser } = useAuthUser()
  const isDarkMode = scheme === 'dark'
  const isSignedIn = authUser.loaded && authUser.props?.username

  return (
    <NavigationContainer
      theme={isDarkMode ? IyiyeNavigationDarkTheme : IyiyeNavigationLightTheme}
    >
      <ReactNativeElementsThemeProvider useDark={isDarkMode}>
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
            activeTintColor: isDarkMode ? 'lightcoral' : 'red',
            inactiveTintColor: 'grey',
            keyboardHidesTabBar: true,
            showLabel: false,
            style: {
              elevation: 0,
              shadowOpacity: 0
            }
          }}
          backBehavior="history"
        >
          <Tab.Screen name={TabNames.Home}>
            {() => HomeStackScreen(t)}
          </Tab.Screen>
          <Tab.Screen name={TabNames.Search}>
            {() => SearchStackScreen(t)}
          </Tab.Screen>
          <Tab.Screen
            name={TabNames.Notification}
            options={{ tabBarBadge: tabCount?.notification ? ' ' : undefined }}
          >
            {() => NotificationStackScreen(t)}
          </Tab.Screen>
          {isSignedIn ? (
            <Tab.Screen name={TabNames.Profile}>
              {() => ProfileStackScreen(t)}
            </Tab.Screen>
          ) : (
            <Tab.Screen name={TabNames.Auth}>
              {() => AuthStackScreen(t)}
            </Tab.Screen>
          )}
        </Tab.Navigator>
      </ReactNativeElementsThemeProvider>
    </NavigationContainer>
  )
}
