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

const Tab = createBottomTabNavigator()

export const RootNavigator: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const { tabBarBadgeCount } = useTabBarBadgeCount()
  const scheme = useColorScheme()
  const { theme: rneTheme } = useContext(ThemeContext)
  const { authUser } = useAuthUser()
  const isDarkMode = scheme === 'dark'
  const isSignedIn = authUser.loaded && authUser.props?.username
  const activeTintColor = isDarkMode ? 'lightcoral' : 'red'
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
                <Tab.Screen name={TabNames.Home} component={HomeStackScreen} />
                <Tab.Screen
                  name={TabNames.Search}
                  component={SearchStackScreen}
                />
                <Tab.Screen
                  name={TabNames.Notification}
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
                    name={TabNames.Profile}
                    component={ProfileStackScreen}
                  />
                ) : (
                  <Tab.Screen
                    name={TabNames.Auth}
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
