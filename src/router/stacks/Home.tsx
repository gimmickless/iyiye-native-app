import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Default as HomeDefault } from 'screens/home'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { HomeStackScreenNames } from 'types/route'

type HomeStackParamList = {
  HomeDefault: undefined
  HomeList: { sort: 'latest' | 'top' } | undefined
  HomeItem: { id: string }
  HomeAuthor?: { userId: string }
}

const HomeStack = createStackNavigator<HomeStackParamList>()

const HomeStackScreen = () => (
  <HomeStack.Navigator
    initialRouteName={HomeStackScreenNames.Default}
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
    <HomeStack.Screen
      name={HomeStackScreenNames.Default}
      component={HomeDefault}
    />
  </HomeStack.Navigator>
)

export default HomeStackScreen
