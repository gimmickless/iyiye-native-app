import React, { useContext } from 'react'
import { useColorScheme } from 'react-native-appearance'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
  AuthStackScreen,
  CartStackScreen,
  HomeStackScreen,
  NotificationStackScreen,
  ProfileStackScreen
} from './DefaultTabScreens'
import { KitDetailModal, Search as HomeSearch } from 'screens/home'
import {
  Default as AuthorProfile,
  Settings as ProfileSettings,
  Orders as ProfileOrders,
  Kits as ProfileKits,
  AuditLog as ProfileAuditLog
} from 'screens/common/profile'

import {
  AddressList as ProfileAddressList,
  AddressLocationSearch as ProfileAddressLocationSearch,
  AddressForm as ProfileAddressForm
} from 'screens/common/address'
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
import {
  CardStyleInterpolators,
  createStackNavigator
} from '@react-navigation/stack'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { AuthUserAddressKey } from 'types/context'
import { Region } from 'react-native-maps'

// eslint-disable-next-line no-shadow
export enum BottomTabNames {
  Home = 'Home',
  Cart = 'Cart',
  Notification = 'Notification',
  Profile = 'Profile',
  Auth = 'Auth'
}

export type RootStackParamList = {
  TabNavigator: undefined
  HomeSearch: undefined
  AuthorProfile: { username: string }
  ProfileSettings: { username: string }
  ProfileOrders: { username: string }
  ProfileKits: { username: string }
  ProfileAuditLog: { username: string }
  ProfileAddressList: { username: string; changedAddressKey: string }
  ProfileAddressLocationSearch: { username: string }
  ProfileAddressForm:
    | { initialRegion: Region; edit?: { key: AuthUserAddressKey } }
    | undefined
  KitDetailModal: { id: string }
}

const Tab = createBottomTabNavigator()
const RootStack = createStackNavigator<RootStackParamList>()

export const RootNavigator: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const { tabBarBadgeCount } = useTabBarBadgeCount()
  const scheme = useColorScheme()
  const { theme: rneTheme } = useContext(ThemeContext)
  const { authUser } = useAuthUser()
  const isDarkMode = scheme === 'dark'
  const isSignedIn = authUser.loaded && authUser.props?.username
  const activeTintColor = isDarkMode ? 'lightcoral' : 'tomato'
  const inactiveTintColor = 'grey'

  const TabNavigator = () => (
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
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          )
        },
        headerShown: false,
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0
        }
      })}
      backBehavior="history"
    >
      <Tab.Screen name={BottomTabNames.Home} component={HomeStackScreen} />
      <Tab.Screen name={BottomTabNames.Cart} component={CartStackScreen} />
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
        <Tab.Screen name={BottomTabNames.Auth} component={AuthStackScreen} />
      )}
    </Tab.Navigator>
  )

  return (
    <NavigationContainer
      theme={isDarkMode ? IyiyeNavigationDarkTheme : IyiyeNavigationLightTheme}
    >
      <ReactNativeElementsThemeProvider useDark={isDarkMode}>
        <ActionSheetProvider>
          <OverflowMenuProvider>
            <TabBarBadgeContextProvider>
              <RootStack.Navigator>
                {/* Tabs */}
                <RootStack.Group
                  screenOptions={{
                    headerShown: false
                  }}
                >
                  <RootStack.Screen
                    name="TabNavigator"
                    component={TabNavigator}
                  />
                </RootStack.Group>
                {/* Home */}
                <RootStack.Group
                  screenOptions={{
                    headerStyle: {
                      elevation: 0,
                      shadowOpacity: 0
                    },
                    headerLeftContainerStyle: {
                      paddingLeft: headerLeftContainerPaddingLeft
                    },
                    cardStyleInterpolator:
                      CardStyleInterpolators.forHorizontalIOS
                  }}
                >
                  <RootStack.Screen name="HomeSearch" component={HomeSearch} />
                  <RootStack.Screen
                    name="AuthorProfile"
                    component={AuthorProfile}
                    options={{
                      title: '',
                      headerTransparent: true
                    }}
                  />
                </RootStack.Group>
                {/* Profile */}
                <RootStack.Group
                  screenOptions={{
                    headerStyle: {
                      elevation: 0,
                      shadowOpacity: 0
                    },
                    headerLeftContainerStyle: {
                      paddingLeft: headerLeftContainerPaddingLeft
                    },
                    cardStyleInterpolator:
                      CardStyleInterpolators.forHorizontalIOS
                  }}
                >
                  <RootStack.Screen
                    name="ProfileSettings"
                    component={ProfileSettings}
                    options={{
                      headerTitle: t('screen.common.profile.settings.title')
                    }}
                  />
                  <RootStack.Screen
                    name="ProfileOrders"
                    component={ProfileOrders}
                    options={{
                      headerTitle: t('screen.common.profile.orders.title')
                    }}
                  />
                  <RootStack.Screen
                    name="ProfileKits"
                    component={ProfileKits}
                    options={{
                      headerTitle: t('screen.common.profile.kits.title')
                    }}
                  />
                  <RootStack.Screen
                    name="ProfileAuditLog"
                    component={ProfileAuditLog}
                    options={{
                      headerTitle: t('screen.common.profile.auditLog.title')
                    }}
                  />
                  <RootStack.Screen
                    name="ProfileAddressList"
                    component={ProfileAddressList}
                    options={{
                      title: t('screen.common.address.list.title')
                    }}
                  />
                  <RootStack.Screen
                    name="ProfileAddressLocationSearch"
                    component={ProfileAddressLocationSearch}
                    options={{}}
                  />
                  <RootStack.Screen
                    name="ProfileAddressForm"
                    component={ProfileAddressForm}
                    options={{}}
                  />
                </RootStack.Group>
                {/* Modals */}
                <RootStack.Group screenOptions={{ presentation: 'modal' }}>
                  <RootStack.Screen
                    name="KitDetailModal"
                    component={KitDetailModal}
                    options={{
                      title: '',
                      cardStyleInterpolator:
                        CardStyleInterpolators.forVerticalIOS,
                      headerTransparent: true
                    }}
                  />
                </RootStack.Group>
              </RootStack.Navigator>
            </TabBarBadgeContextProvider>
          </OverflowMenuProvider>
        </ActionSheetProvider>
      </ReactNativeElementsThemeProvider>
    </NavigationContainer>
  )
}
