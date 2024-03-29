import { useNavigation } from '@react-navigation/native'
import { useAuthUser } from 'contexts/Auth'
import { LocalizationContext } from 'contexts/Localization'
import React, { useContext, useLayoutEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { useColorScheme } from 'react-native-appearance'
import { SearchBar, ThemeContext } from 'react-native-elements'
import {
  defaultContainerViewHorizontalPadding,
  homeHeaderHeight,
  searchHeaderSearchBarWidthSubtrahend
} from 'utils/constants'

const Search: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const scheme = useColorScheme()
  const { theme: rneTheme } = useContext(ThemeContext)
  const { authUser } = useAuthUser()
  const [searchText, setSearchText] = useState('')

  const isDarkMode = scheme === 'dark'

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
          platform="default"
          lightTheme={!isDarkMode}
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
    width: Dimensions.get('window').width - searchHeaderSearchBarWidthSubtrahend,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  searchBarInputStyle: {}
})

export default Search
