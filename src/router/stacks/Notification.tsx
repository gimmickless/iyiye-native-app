import React, { useContext } from 'react'
import {
  CardStyleInterpolators,
  createStackNavigator
} from '@react-navigation/stack'
import { Default } from 'screens/notification'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { useTabBarBadgeCount } from 'contexts/TabBarBadge'
import { useFocusEffect } from '@react-navigation/native'

export type NotificationStackParamList = {
  Default: undefined
}

const NotificationStack = createStackNavigator<NotificationStackParamList>()

const NotificationStackScreen: React.FC = () => {
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
    <NotificationStack.Navigator
      initialRouteName="Default"
      screenOptions={{
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0
        },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerLeftContainerStyle: {
          paddingLeft: headerLeftContainerPaddingLeft
        }
      }}
    >
      <NotificationStack.Screen
        name="Default"
        component={Default}
        options={{
          title: t('screen.notifications.default.title')
        }}
      />
    </NotificationStack.Navigator>
  )
}

export default NotificationStackScreen
