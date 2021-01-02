import React from 'react'
import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import { Default as SearchDefault } from 'screens/search'
import { headerLeftContainerPaddingLeft } from 'utils/constants'

type SearchStackParamList = {
  Default: undefined
  List: { sort: 'latest' | 'top' } | undefined
  Item: { id: string }
  Author: { userId: string }
  Summary: undefined
  Checkout: undefined
}

const SearchStack = createStackNavigator<SearchStackParamList>()

const SearchStackScreen = (t: Function) => (
  <SearchStack.Navigator
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
    <SearchStack.Screen name="Default" component={SearchDefault} />
  </SearchStack.Navigator>
)

export default SearchStackScreen
