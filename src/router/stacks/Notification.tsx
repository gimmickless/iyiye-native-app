import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Default as NotificationDefault } from 'screens/notification'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { NotificationStackScreenNames } from 'types/route'
import { Scope, TranslateOptions } from 'i18n-js'

type NotificationStackParamList = {
  NotificationDefault: undefined
}

const NotificationStack = createStackNavigator<NotificationStackParamList>()

const NotificationStackScreen = (
  t: (scope: Scope, options?: TranslateOptions) => string
) => (
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

export default NotificationStackScreen
