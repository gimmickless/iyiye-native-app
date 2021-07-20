import { useNavigation } from '@react-navigation/native'
import { useAuthUser } from 'contexts/Auth'
import { LocalizationContext } from 'contexts/Localization'
import React, { useContext, useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SearchBar, ThemeContext } from 'react-native-elements'
import {
  defaultContainerViewHorizontalPadding,
  homeHeaderHeight
} from 'utils/constants'

const Search: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const { theme: rneTheme } = useContext(ThemeContext)
  const { authUser } = useAuthUser()
  const [searchText, setSearchText] = useState('')

  // Customize header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { height: homeHeaderHeight, elevation: 0, shadowOpacity: 0 },
      headerTitle: () => (
        <SearchBar
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          value={searchText}
          onChangeText={(val: string) => setSearchText(val)}
          containerStyle={styles.searchBarContainerStyle}
          inputStyle={{
            ...styles.searchBarInputStyle,
            color: rneTheme.colors?.black
          }}
          autoCorrect={false}
          placeholder={t('screen.home.search.placeholder.search')}
          returnKeyType="search"
          textContentType="none"
          cancelButtonTitle={t('common.button.cancel')}
        />
      )
    })
  }, [navigation, rneTheme.colors?.black, searchText, t])

  return (
    <View style={styles.view}>
      {!searchText ? (
        <Text>Search results go here</Text>
      ) : (
        <Text>Initial (no search) content goes here</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: defaultContainerViewHorizontalPadding
  },
  searchBarContainerStyle: {
    minWidth: 200,
    width: 'auto',
    backgroundColor: 'transparent'
  },
  searchBarInputStyle: {}
})

export default Search
