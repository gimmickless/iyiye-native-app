import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Default as SearchDefault } from 'screens/search'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { SearchStackScreenNames } from 'types/route'

type SearchStackParamList = {
  SearchDefault: undefined
  SearchList: { sort: 'latest' | 'top' } | undefined
  SearchItem: { id: string }
  SearchAuthor: { userId: string }
  SearchSummary: undefined
  SearchCheckout: undefined
}

const SearchStack = createStackNavigator<SearchStackParamList>()

const SearchStackScreen = (t: (scope: any, options?: any) => string) => (
  <SearchStack.Navigator
    initialRouteName={SearchStackScreenNames.Default}
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
    <SearchStack.Screen
      name={SearchStackScreenNames.Default}
      component={SearchDefault}
    />
  </SearchStack.Navigator>
)

export default SearchStackScreen
