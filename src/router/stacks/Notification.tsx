import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Default as NotificationDefault } from 'screens/notification'
import { headerLeftContainerPaddingLeft } from 'utils/constants'

type NotificationStackParamList = {
  Default: undefined
}

const NotificationStack = createStackNavigator<NotificationStackParamList>()

const NotificationStackScreen = () => (
  <NotificationStack.Navigator
    initialRouteName="Default"
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
    <NotificationStack.Screen name="Default" component={NotificationDefault} />
  </NotificationStack.Navigator>
)

export default NotificationStackScreen
