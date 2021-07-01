import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Default as SearchDefault } from 'screens/search'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'

export type SearchStackParamList = {
  Default: undefined
}

const SearchStack = createStackNavigator<SearchStackParamList>()

const SearchStackScreen: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  return (
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
}

export default SearchStackScreen
