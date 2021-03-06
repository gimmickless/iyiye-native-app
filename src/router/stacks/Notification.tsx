import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Default as NotificationDefault } from 'screens/notification'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { NotificationStackScreenNames } from 'types/route'

type NotificationStackParamList = {
  NotificationDefault: undefined
}

const NotificationStack = createStackNavigator<NotificationStackParamList>()

const NotificationStackScreen = (t: (scope: any, options?: any) => string) => (
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
    />
  </NotificationStack.Navigator>
)

export default NotificationStackScreen
