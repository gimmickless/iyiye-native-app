import 'react-native-gesture-handler'
import React, { useContext } from 'react'
// import { StatusBar } from 'expo-status-bar'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { Avatar } from 'react-native-elements'
import './i18n'
import { Ionicons } from '@expo/vector-icons'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AuthUserContextProvider, { AuthUserContext } from 'contexts/Auth'
import RecipeListScreen from 'screens/recipe/List'
import RecipeItemScreen from 'screens/recipe/Item'
import NotificationListScreen from 'screens/notification/List'
import NotificationItemScreen from 'screens/notification/Item'
import ProfileScreen from 'screens/user/Profile'
import SettingsScreen from 'screens/Settings'
import CartSummaryScreen from 'screens/cart/Summary'
import CartCheckoutScreen from 'screens/cart/Checkout'
import SignInScreen from 'screens/auth/SignIn'
import SignUpScreen from 'screens/auth/SignUp'
import ConfirmAccountScreen from 'screens/auth/ConfirmAccount'
import ResetPasswordScreen from 'screens/auth/ResetPassword'
import SignOutScreen from 'screens/auth/SignOut'
import {
  drawerItemBlurColor,
  drawerItemFocusColor,
  headerLeftContainerPaddingLeft
} from 'utils/constants'

type DrawerParamList = {
  Default: undefined
  Profile?: { userId: string }
  Settings?: { userId: string }
  SignOut?: undefined
  UnauthAccountOps?: undefined
}

type UnauthStackParamList = {
  SignIn: undefined
  SignUp: undefined
  ConfirmAccount: undefined
  ResetPassword: undefined
}

type UnauthDefaultTabParamList = {
  Home: undefined
}

type AuthDefaultTabParamList = {
  Home: undefined
  Favorites: undefined
  Cart: undefined
  Notifications: undefined
}

type RecipeKitScreenStackParamList = {
  List: { sort: 'latest' | 'top' } | undefined
  Item: { id: string }
  Author?: { userId: string }
}

type FavoriteScreenStackParamList = {
  List: { sort: 'latest' | 'top' } | undefined
  Item: { id: string }
  Author: { userId: string }
}

type CartScreenStackParamList = {
  Summary: undefined
  Checkout: undefined
}

type NotificationScreenStackParamList = {
  List: undefined
  Item: { id: string }
}

const Drawer = createDrawerNavigator<DrawerParamList>()
const UnauthDefaultTab = createBottomTabNavigator<UnauthDefaultTabParamList>()
const AuthDefaultTab = createBottomTabNavigator<AuthDefaultTabParamList>()
const UnauthStack = createStackNavigator<UnauthStackParamList>()
const RecipeKitScreenStack = createStackNavigator<RecipeKitScreenStackParamList>()
const FavoriteScreenStack = createStackNavigator<FavoriteScreenStackParamList>()
const CartScreenStack = createStackNavigator<CartScreenStackParamList>()
const NotificationScreenStack = createStackNavigator<NotificationScreenStackParamList>()

const AuthDefaultTabs = (t: TFunction, authUserAvatarUrl: string) => (
  <AuthDefaultTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = ''
        if (route.name === 'Home') {
          iconName = 'ios-home'
        } else if (route.name === 'Favorites') {
          iconName = focused ? 'ios-star' : 'ios-star-outline'
        } else if (route.name === 'Cart') {
          iconName = 'ios-cart'
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
    <AuthDefaultTab.Screen name="Home">
      {({ navigation }) => (
        <RecipeKitScreenStack.Navigator
          initialRouteName="List"
          screenOptions={{
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0
            },
            headerLeftContainerStyle: {
              paddingLeft: headerLeftContainerPaddingLeft
            }
          }}
        >
          <RecipeKitScreenStack.Screen
            name="List"
            component={RecipeListScreen}
            options={{
              title: t('screen.recipeKits.title'),
              headerLeft: () => (
                <Avatar
                  rounded
                  icon={{ name: 'ios-person', type: 'ionicon' }}
                  source={{ uri: authUserAvatarUrl }}
                  onPress={() => navigation.toggleDrawer()}
                />
              )
            }}
          />
          <RecipeKitScreenStack.Screen
            name="Item"
            component={RecipeItemScreen}
          />
          <RecipeKitScreenStack.Screen
            name="Author"
            component={ProfileScreen}
          />
        </RecipeKitScreenStack.Navigator>
      )}
    </AuthDefaultTab.Screen>
    <AuthDefaultTab.Screen name="Favorites">
      {({ navigation }) => (
        <FavoriteScreenStack.Navigator
          initialRouteName="List"
          screenOptions={{
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0
            },
            headerLeftContainerStyle: {
              paddingLeft: headerLeftContainerPaddingLeft
            }
          }}
        >
          <FavoriteScreenStack.Screen
            name="List"
            component={RecipeListScreen}
            options={{
              title: t('screen.favorites.title'),
              headerLeft: () => (
                <Avatar
                  rounded
                  icon={{ name: 'ios-person', type: 'ionicon' }}
                  source={{ uri: authUserAvatarUrl }}
                  onPress={() => navigation.toggleDrawer()}
                />
              )
            }}
          />
          <FavoriteScreenStack.Screen
            name="Item"
            component={RecipeItemScreen}
          />
          <FavoriteScreenStack.Screen name="Author" component={ProfileScreen} />
        </FavoriteScreenStack.Navigator>
      )}
    </AuthDefaultTab.Screen>
    <AuthDefaultTab.Screen
      name="Cart"
      options={{
        tabBarBadge: 3
      }}
    >
      {({ navigation }) => (
        <CartScreenStack.Navigator
          initialRouteName="Summary"
          screenOptions={{
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0
            },
            headerLeftContainerStyle: {
              paddingLeft: headerLeftContainerPaddingLeft
            }
          }}
        >
          <CartScreenStack.Screen
            name="Summary"
            component={CartSummaryScreen}
            options={{
              title: t('screen.cart.summary.title'),
              headerLeft: () => (
                <Avatar
                  rounded
                  icon={{ name: 'ios-person', type: 'ionicon' }}
                  source={{ uri: authUserAvatarUrl }}
                  onPress={() => navigation.toggleDrawer()}
                />
              )
            }}
          />
          <CartScreenStack.Screen
            name="Checkout"
            component={CartCheckoutScreen}
            options={{
              title: t('screen.cart.checkout.title')
            }}
          />
        </CartScreenStack.Navigator>
      )}
    </AuthDefaultTab.Screen>
    <AuthDefaultTab.Screen
      name="Notifications"
      options={{
        tabBarBadge: 3
      }}
    >
      {({ navigation }) => (
        <NotificationScreenStack.Navigator
          initialRouteName="List"
          screenOptions={{
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0
            },
            headerLeftContainerStyle: {
              paddingLeft: headerLeftContainerPaddingLeft
            }
          }}
        >
          <NotificationScreenStack.Screen
            name="List"
            component={NotificationListScreen}
            options={{
              title: t('screen.notifications.title'),
              headerLeft: () => (
                <Avatar
                  rounded
                  icon={{ name: 'ios-person', type: 'ionicon' }}
                  source={{ uri: authUserAvatarUrl }}
                  onPress={() => navigation.toggleDrawer()}
                />
              )
            }}
          />
          <NotificationScreenStack.Screen
            name="Item"
            component={NotificationItemScreen}
          />
        </NotificationScreenStack.Navigator>
      )}
    </AuthDefaultTab.Screen>
  </AuthDefaultTab.Navigator>
)

const UnauthDefaultTabs = (t: TFunction) => (
  <UnauthDefaultTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = ''
        if (route.name === 'Home') {
          iconName = 'ios-home'
        }
        return <Ionicons name={iconName} size={size} color={color} />
      }
    })}
    tabBarOptions={{
      activeTintColor: 'red',
      inactiveTintColor: 'gray',
      style: {
        elevation: 0,
        shadowOpacity: 0
      }
    }}
  >
    <UnauthDefaultTab.Screen name="Home">
      {({ navigation }) => (
        <RecipeKitScreenStack.Navigator
          initialRouteName="List"
          screenOptions={{
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0
            },
            headerLeftContainerStyle: {
              paddingLeft: headerLeftContainerPaddingLeft
            }
          }}
        >
          <RecipeKitScreenStack.Screen
            name="List"
            component={RecipeListScreen}
            options={{
              title: t('screen.recipeKits.title'),
              headerLeft: () => (
                <Avatar
                  rounded
                  icon={{ name: 'ios-person', type: 'ionicon' }}
                  source={{ uri: 'foo.jpg' }} // Even if dummmy, if source does not exist, it does not show
                  onPress={() => navigation.toggleDrawer()}
                />
              )
            }}
          />
          <RecipeKitScreenStack.Screen
            name="Item"
            component={RecipeItemScreen}
          />
        </RecipeKitScreenStack.Navigator>
      )}
    </UnauthDefaultTab.Screen>
  </UnauthDefaultTab.Navigator>
)

const UnauthAccountOpsStack = (t: TFunction) => (
  <UnauthStack.Navigator
    initialRouteName="SignIn"
    screenOptions={{
      headerShown: false
    }}
  >
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
)

const App: React.FC = () => {
  const { t } = useTranslation()
  const { state: authUser } = useContext(AuthUserContext)
  console.log(authUser)
  // TODO: Get User Avatar
  const authUserAvatarUrl = 'avatar.jpg'
  const isSignedIn = false

  return (
    <AuthUserContextProvider>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Default">
          {isSignedIn ? (
            <React.Fragment>
              <Drawer.Screen
                name="Default"
                options={{
                  drawerLabel: t('drawer.auth.default.title'),
                  drawerIcon: ({ focused, size }) => (
                    <Ionicons
                      name="ios-home"
                      size={size}
                      color={
                        focused ? drawerItemFocusColor : drawerItemBlurColor
                      }
                    />
                  )
                }}
              >
                {() => AuthDefaultTabs(t, authUserAvatarUrl)}
              </Drawer.Screen>
              <Drawer.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                  drawerLabel: t('drawer.auth.profile.title'),
                  drawerIcon: ({ focused, size }) => (
                    <Ionicons
                      name="ios-person"
                      size={size}
                      color={
                        focused ? drawerItemFocusColor : drawerItemBlurColor
                      }
                    />
                  )
                }}
              />
              <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                  drawerLabel: t('drawer.auth.settings.title'),
                  drawerIcon: ({ focused, size }) => (
                    <Ionicons
                      name="ios-settings"
                      size={size}
                      color={
                        focused ? drawerItemFocusColor : drawerItemBlurColor
                      }
                    />
                  )
                }}
              />
              <Drawer.Screen
                name="SignOut"
                component={SignOutScreen}
                options={{
                  drawerLabel: t('drawer.auth.signOut.title'),
                  drawerIcon: ({ focused, size }) => (
                    <Ionicons
                      name="ios-log-out"
                      size={size}
                      color={
                        focused ? drawerItemFocusColor : drawerItemBlurColor
                      }
                    />
                  )
                }}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Drawer.Screen
                name="Default"
                options={{
                  drawerLabel: t('drawer.unauth.default.title'),
                  drawerIcon: ({ focused, size }) => (
                    <Ionicons
                      name="ios-home"
                      size={size}
                      color={
                        focused ? drawerItemFocusColor : drawerItemBlurColor
                      }
                    />
                  )
                }}
              >
                {() => UnauthDefaultTabs(t)}
              </Drawer.Screen>
              <Drawer.Screen
                name="UnauthAccountOps"
                options={{
                  drawerLabel: t('drawer.unauth.accountOps.title'),
                  drawerIcon: ({ focused, size }) => (
                    <Ionicons
                      name="ios-log-in"
                      size={size}
                      color={
                        focused ? drawerItemFocusColor : drawerItemBlurColor
                      }
                    />
                  )
                }}
              >
                {() => UnauthAccountOpsStack(t)}
              </Drawer.Screen>
            </React.Fragment>
          )}
        </Drawer.Navigator>
      </NavigationContainer>
    </AuthUserContextProvider>
  )
}

export default App
