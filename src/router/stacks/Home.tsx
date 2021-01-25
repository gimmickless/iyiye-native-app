import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {
  Default as HomeDefault,
  Addresses as HomeAddresses
} from 'screens/home'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { HomeStackScreenNames } from 'types/route'

type HomeStackParamList = {
  HomeDefault: undefined
  HomeAddresses: undefined
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
    <HomeStack.Screen
      name={HomeStackScreenNames.Addresses}
      component={HomeAddresses}
    />
  </HomeStack.Navigator>
)

export default HomeStackScreen
