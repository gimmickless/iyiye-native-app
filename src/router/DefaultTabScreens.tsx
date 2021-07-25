import React, { useContext } from 'react'
import {
  CardStyleInterpolators,
  createStackNavigator
} from '@react-navigation/stack'
import { LocalizationContext } from 'contexts/Localization'
import { ConfirmAccount, ForgotPassword, SignIn, SignUp } from 'screens/auth'
import { Default as HomeDefault } from 'screens/home'
import { Default as CartDefault } from 'screens/cart'
import { Default as NotificationDefault } from 'screens/notification'
import { Default as ProfileDefault } from 'screens/profile'
import { useTabBarBadgeCount } from 'contexts/TabBarBadge'
import { headerLeftContainerPaddingLeft } from 'utils/constants'

export type AuthStackParamList = {
  SignIn: undefined
  SignUp: undefined
  ConfirmAccount: { email: string; username: string }
  ForgotPassword: undefined
}

export type HomeStackParamList = {
  HomeDefault: undefined
}

export type CartStackParamList = {
  CartDefault: undefined
}

export type NotificationStackParamList = {
  NotificationDefault: undefined
}

export type ProfileStackParamList = {
  ProfileDefault: { username?: string }
}

const AuthStack = createStackNavigator<AuthStackParamList>()
const HomeStack = createStackNavigator<HomeStackParamList>()
const CartStack = createStackNavigator<CartStackParamList>()
const NotificationStack = createStackNavigator<NotificationStackParamList>()
const ProfileStack = createStackNavigator<ProfileStackParamList>()

export const AuthStackScreen: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  return (
    <AuthStack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0
        },
        headerLeftContainerStyle: {
          paddingLeft: headerLeftContainerPaddingLeft
        },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
      }}
    >
      <AuthStack.Screen
        name="SignIn"
        component={SignIn}
        options={{
          title: t('screen.auth.signIn.title')
        }}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          title: t('screen.auth.signUp.title')
        }}
      />
      <AuthStack.Screen
        name="ConfirmAccount"
        component={ConfirmAccount}
        options={{
          title: t('screen.auth.confirmAccount.title')
        }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          title: t('screen.auth.forgotPassword.title')
        }}
      />
    </AuthStack.Navigator>
  )
}

export const HomeStackScreen: React.FC = () => {
  return (
    <HomeStack.Navigator initialRouteName="HomeDefault">
      <HomeStack.Screen name="HomeDefault" component={HomeDefault} />
    </HomeStack.Navigator>
  )
}

export const CartStackScreen: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  return (
    <CartStack.Navigator initialRouteName="CartDefault">
      <CartStack.Screen
        name="CartDefault"
        component={CartDefault}
        options={{
          title: t('screen.cart.default.title')
        }}
      />
    </CartStack.Navigator>
  )
}

export const NotificationStackScreen: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const { tabBarBadgeCount, setTabBarBadgeCount } = useTabBarBadgeCount()

  // useFocusEffect(
  //   useCallback(() => {
  //     setTabBarBadgeCount({
  //       ...tabBarBadgeCount,
  //       notification: 0
  //     })
  //   }, [setTabBarBadgeCount, tabBarBadgeCount])
  // )
  return (
    <NotificationStack.Navigator initialRouteName="NotificationDefault">
      <NotificationStack.Screen
        name="NotificationDefault"
        component={NotificationDefault}
        options={{
          title: t('screen.notifications.default.title')
        }}
      />
    </NotificationStack.Navigator>
  )
}

export const ProfileStackScreen: React.FC = () => {
  return (
    <ProfileStack.Navigator initialRouteName="ProfileDefault">
      <ProfileStack.Screen
        name="ProfileDefault"
        component={ProfileDefault}
        options={{
          headerTitle: '',
          headerTransparent: true
        }}
      />
    </ProfileStack.Navigator>
  )
}
