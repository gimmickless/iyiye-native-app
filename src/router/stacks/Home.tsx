import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Default as HomeDefault } from 'screens/home'
import { headerLeftContainerPaddingLeft } from 'utils/constants'

type HomeStackParamList = {
  Default: undefined
  List: { sort: 'latest' | 'top' } | undefined
  Item: { id: string }
  Author?: { userId: string }
}

const HomeStack = createStackNavigator<HomeStackParamList>()

const HomeStackScreen = () => (
  <HomeStack.Navigator
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
    <HomeStack.Screen name="Default" component={HomeDefault} />
  </HomeStack.Navigator>
)

export default HomeStackScreen
