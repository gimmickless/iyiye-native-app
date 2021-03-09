import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'
import * as Location from 'expo-location'
import * as Cellular from 'expo-cellular'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  useColorScheme
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LocalizationContext } from 'contexts/Localization'
import { useNavigation, useTheme } from '@react-navigation/native'
import { HomeStackScreenNames } from 'types/route'
import {
  getHyperlinkTextColor,
  globalAsyncStorageKeyPrefix,
  googlePlacesAutocompleteBaseUrl,
  listItemFontSize
} from 'utils/constants'
import { useInAppNotification } from 'contexts/InAppNotification'
import { SearchBar, ThemeContext } from 'react-native-elements'
import { GoogleConfig } from 'config'
import { useDebouncedSearch } from 'hooks'

const recentLocationSearchesKey = `${globalAsyncStorageKeyPrefix}:recentLocationSearches`

const searchPlaceAsync = async (search: string) => {
  const url = googlePlacesAutocompleteBaseUrl
  url.searchParams.append('key', GoogleConfig.Places.apiKey ?? '')
  url.searchParams.append('types', 'address')
  if (Cellular.isoCountryCode) {
    url.searchParams.append('components', `country:${Cellular.isoCountryCode}`)
  }
  url.searchParams.append('input', search)
  // console.log('url: ' + url.toString())
  const response = await fetch(url.toString())
  const data = await response.json()
  console.log(data)
  return data
}

const useDebouncedPlaceSearch = () =>
  useDebouncedSearch((search: string) => searchPlaceAsync(search))

const LocationSearch: React.FC = () => {
  const { addNotification } = useInAppNotification()
  const { colors } = useTheme()
  const scheme = useColorScheme()
  const { theme: rneTheme } = useContext(ThemeContext)
  const [recentSearchesData, setRecentSearchesData] = useState<any[]>([])
  const [searchResultData, setSearchResultData] = useState<any[]>([])
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const {
    inputText: searchText,
    setInputText: setSearchText,
    searchResults
  } = useDebouncedPlaceSearch()

  const currentLocationData = useMemo(() => {
    return [
      {
        title: t(
          'screen.home.addressLocationSearch.quickAccessSectionList.currLocationItem'
        )
      }
    ]
  }, [t])

  useEffect(() => {
    console.log('Filter results soon')
    if (searchResults.error) {
      addNotification({
        message: searchResults.error.message,
        type: 'error'
      })
      setSearchResultData([])
      return
    }
    if (searchResults.loading) {
      setSearchResultData([])
      return
    }
    console.log('Filter results now')
    const basicSearchResults = searchResults.result.map((x: any) => ({
      mainText: x.structured_formatting.main_text,
      description: x.description
    }))
    setSearchResultData(basicSearchResults)
  }, [addNotification, searchResults])

  useEffect(() => {
    ;(async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(recentLocationSearchesKey)
        const storageDataStrArray = jsonValue ? JSON.parse(jsonValue) : []
        setRecentSearchesData(
          storageDataStrArray.map((i: string) => ({
            title: i
          }))
        )
      } catch (err) {
        addNotification({
          message: err,
          type: 'error'
        })
      }
    })()
  }, [addNotification])

  // Customize header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <SearchBar
          value={searchText}
          onChangeText={(val: string) => setSearchText(val)}
          containerStyle={styles.searchBarContainerStyle}
          inputStyle={{
            ...styles.searchBarInputStyle,
            color: rneTheme.colors?.black
          }}
          autoCorrect={false}
          placeholder={t(
            'screen.home.addressLocationSearch.titleSearchTextInput.placeholder'
          )}
          returnKeyType="done"
          textContentType="streetAddressLine1"
          cancelButtonTitle={t('common.button.cancel')}
        />
      )
    })
  }, [navigation, rneTheme.colors?.black, searchText, setSearchText, t])

  const addRecentSearch = async (val: string) => {
    try {
      setRecentSearchesData((searches) => [...searches, val])
      await AsyncStorage.setItem(
        recentLocationSearchesKey,
        JSON.stringify(recentSearchesData)
      )
    } catch (err) {
      addNotification({
        message: err.message ?? err,
        type: 'error'
      })
    }
  }

  const onUseCurrentLocationPress = async () => {
    const { status } = await Location.requestPermissionsAsync()
    if (status !== 'granted') {
      addNotification({
        message: t('screen.home.addressList.message.locationPermissionDenied'),
        type: 'error'
      })
    }
    const location = await Location.getCurrentPositionAsync({})
    navigation.navigate(HomeStackScreenNames.AddressForm, location)
  }

  const onClearSearchHistory = async () => {
    try {
      await AsyncStorage.setItem(recentLocationSearchesKey, JSON.stringify([]))
      setRecentSearchesData([])
    } catch (err) {
      addNotification({
        message: err.message ?? err,
        type: 'error'
      })
    }
  }

  const CurrentLocationItem = ({ title }: any) => (
    <View
      style={{
        ...styles.listItem,
        ...styles.currentLocationItem
      }}
    >
      <View style={styles.listItemIconContainer}>
        <MaterialIcons
          name="my-location"
          size={listItemFontSize}
          color={colors.text}
        />
      </View>
      <View style={styles.listItemMainContainer}>
        <Text style={{ ...styles.listItemMainText, color: colors.text }}>
          {title}
        </Text>
      </View>
      <View style={styles.listItemIconContainer}>
        <MaterialCommunityIcons
          name="arrow-right"
          size={listItemFontSize}
          color={colors.text}
        />
      </View>
    </View>
  )

  const RecentSearchItem = ({ title }: any) => (
    <View style={[styles.listItem, styles.recentSearchItem]}>
      <View style={styles.listItemIconContainer}>
        <MaterialCommunityIcons
          name="history"
          size={listItemFontSize}
          color={colors.text}
        />
      </View>
      <View style={styles.listItemMainContainer}>
        <Text style={{ ...styles.listItemMainText, color: colors.text }}>
          {title}
        </Text>
      </View>
      <View style={styles.listItemIconContainer}>
        <MaterialCommunityIcons
          name="arrow-right"
          size={listItemFontSize}
          color={colors.text}
        />
      </View>
    </View>
  )

  const SearchResultItem = ({ title }: any) => (
    <View style={[styles.listItem, styles.searchResultItem]}>
      <View style={styles.listItemIconContainer}>
        <MaterialCommunityIcons
          name="map-search"
          size={listItemFontSize}
          color={colors.text}
        />
      </View>
      <View style={styles.listItemMainContainer}>
        <Text style={{ ...styles.listItemMainText, color: colors.text }}>
          {title}
        </Text>
      </View>
      <View style={styles.listItemIconContainer}>
        <MaterialCommunityIcons
          name="arrow-right"
          size={listItemFontSize}
          color={colors.text}
        />
      </View>
    </View>
  )

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {!searchText ? (
        <React.Fragment>
          <FlatList
            data={currentLocationData}
            renderItem={({ item }) => (
              <CurrentLocationItem title={item.title} />
            )}
            keyExtractor={(_item, index) => `${index}`}
          />
          <View style={styles.searchHistoryHeaderLine}>
            <Text
              style={{
                ...styles.searchHistoryHeaderText,
                color: rneTheme.colors?.grey3
              }}
            >
              {t(
                'screen.home.addressLocationSearch.quickAccessSectionList.listTitle.recents'
              )}
            </Text>
            <Pressable onPress={onClearSearchHistory}>
              <Text
                style={{
                  ...styles.clearAllButton,
                  color: getHyperlinkTextColor(scheme === 'dark')
                }}
              >
                {t(
                  'screen.home.addressLocationSearch.quickAccessSectionList.button.clearHistory'
                )}
              </Text>
            </Pressable>
          </View>
          <FlatList
            data={recentSearchesData}
            renderItem={({ item }) => <RecentSearchItem title={item.title} />}
            keyExtractor={(_item, index) => `${index}`}
          />
        </React.Fragment>
      ) : (
        <FlatList
          data={searchResultData}
          renderItem={({ item }) => <SearchResultItem title={item.title} />}
          keyExtractor={(item) => item.id}
        />
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20
  },
  searchBarContainerStyle: {
    backgroundColor: 'transparent'
  },
  searchBarInputStyle: {},
  sectionListHeader: {
    fontSize: 22
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 8,
    paddingVertical: 20
  },
  currentLocationItem: {},
  searchHistoryHeaderLine: {
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  searchHistoryHeaderText: {},
  clearAllButton: {},
  recentSearchItem: {},
  searchResultItem: {},
  listItemMainText: {
    fontSize: listItemFontSize
  },
  listItemIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItemMainContainer: {
    flex: 5,
    justifyContent: 'center'
  }
})

export default LocationSearch
