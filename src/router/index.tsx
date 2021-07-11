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
  CartStackScreen
} from './stacks'
import {
  IyiyeNavigationLightTheme,
  IyiyeNavigationDarkTheme
} from 'utils/theme'
import {
  ThemeContext,
  ThemeProvider as ReactNativeElementsThemeProvider
} from 'react-native-elements'

import { useAuthUser } from 'contexts/Auth'
import TabBarBadgeContextProvider, {
  useTabBarBadgeCount
} from 'contexts/TabBarBadge'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { OverflowMenuProvider } from 'react-navigation-header-buttons'

// eslint-disable-next-line no-shadow
export enum BottomTabNames {
  Home = 'Home',
  Cart = 'Cart',
  Notification = 'Notification',
  Profile = 'Profile',
  Auth = 'Auth'
}

const Tab = createBottomTabNavigator()

export const RootNavigator: React.FC = () => {
  const { tabBarBadgeCount } = useTabBarBadgeCount()
  const scheme = useColorScheme()
  const { theme: rneTheme } = useContext(ThemeContext)
  const { authUser } = useAuthUser()
  const isDarkMode = scheme === 'dark'
  const isSignedIn = authUser.loaded && authUser.props?.username
  const activeTintColor = isDarkMode ? 'lightcoral' : 'tomato'
  const inactiveTintColor = 'grey'

  return (
    <NavigationContainer
      theme={isDarkMode ? IyiyeNavigationDarkTheme : IyiyeNavigationLightTheme}
    >
      <ReactNativeElementsThemeProvider useDark={isDarkMode}>
        <ActionSheetProvider>
          <OverflowMenuProvider>
            <TabBarBadgeContextProvider>
              <Tab.Navigator
                initialRouteName={BottomTabNames.Home}
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName
                    if (route.name === BottomTabNames.Home) {
                      iconName = focused ? 'home' : 'home-outline'
                    } else if (route.name === BottomTabNames.Cart) {
                      iconName = focused ? 'cart' : 'cart-outline'
                    } else if (route.name === BottomTabNames.Notification) {
                      iconName = focused ? 'bell' : 'bell-outline'
                    } else if (route.name === BottomTabNames.Profile) {
                      iconName = focused ? 'account' : 'account-outline'
                    } else if (route.name === BottomTabNames.Auth) {
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
                  activeTintColor: activeTintColor,
                  inactiveTintColor: inactiveTintColor,
                  keyboardHidesTabBar: true,
                  showLabel: false,
                  style: {
                    elevation: 0,
                    shadowOpacity: 0
                  }
                }}
                backBehavior="history"
              >
                <Tab.Screen
                  name={BottomTabNames.Home}
                  component={HomeStackScreen}
                />
                <Tab.Screen
                  name={BottomTabNames.Cart}
                  component={CartStackScreen}
                />
                <Tab.Screen
                  name={BottomTabNames.Notification}
                  component={NotificationStackScreen}
                  options={
                    tabBarBadgeCount?.notification
                      ? {
                          tabBarBadge: tabBarBadgeCount.notification,
                          tabBarBadgeStyle: {
                            backgroundColor: activeTintColor,
                            color: rneTheme.colors?.white
                          }
                        }
                      : undefined
                  }
                />
                {isSignedIn ? (
                  <Tab.Screen
                    name={BottomTabNames.Profile}
                    component={ProfileStackScreen}
                  />
                ) : (
                  <Tab.Screen
                    name={BottomTabNames.Auth}
                    component={AuthStackScreen}
                  />
                )}
              </Tab.Navigator>
            </TabBarBadgeContextProvider>
          </OverflowMenuProvider>
        </ActionSheetProvider>
      </ReactNativeElementsThemeProvider>
    </NavigationContainer>
  )
}
