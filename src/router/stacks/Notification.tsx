import React, { useCallback, useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Default as NotificationDefault } from 'screens/notification'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { useTabBarBadgeCount } from 'contexts/TabBarBadge'
import { useFocusEffect } from '@react-navigation/native'

export enum NotificationStackScreenNames {
  Default = 'NotificationDefault'
}

export type NotificationStackParamList = {
  NotificationDefault: undefined
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
      initialRouteName={NotificationStackScreenNames.Default}
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
      <NotificationStack.Screen
        name={NotificationStackScreenNames.Default}
        component={NotificationDefault}
        options={{
          title: t('screen.notifications.default.title')
        }}
      />
    </NotificationStack.Navigator>
  )
}

export default NotificationStackScreen
