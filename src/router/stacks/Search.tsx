import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Default as SearchDefault } from 'screens/search'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'

export enum SearchStackScreenNames {
  Default = 'SearchDefault'
}

export type SearchStackParamList = {
  SearchDefault: undefined
  SearchList: { sort: 'latest' | 'top' } | undefined
  SearchItem: { id: string }
  SearchAuthor: { userId: string }
  SearchSummary: undefined
  SearchCheckout: undefined
}

const SearchStack = createStackNavigator<SearchStackParamList>()

const SearchStackScreen: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  return (
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
}

export default SearchStackScreen
