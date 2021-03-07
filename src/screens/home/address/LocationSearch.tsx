import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'
import * as Location from 'expo-location'
import * as Cellular from 'expo-cellular'
import { MaterialIcons } from '@expo/vector-icons'
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
  Text,
  FlatList,
  Pressable,
  useColorScheme
} from 'react-native'
import { debounce } from 'debounce'
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
import { ThemeContext } from 'react-native-elements'

const recentLocationSearchesKey = `${globalAsyncStorageKeyPrefix}:recentLocationSearches`

const LocationSearch: React.FC = () => {
  const { addNotification } = useInAppNotification()
  const { colors } = useTheme()
  const scheme = useColorScheme()
  const { theme: rneTheme } = useContext(ThemeContext)
  const [search, setSearch] = useState('')
  const [recentSearchesData, setRecentSearchesData] = useState<any[]>([])
  const [searchResultData, setSearchResultData] = useState<any[]>([])
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()

  const delayedFetchAutocomplete = useMemo(
    () =>
      debounce(async () => {
        const url = googlePlacesAutocompleteBaseUrl
        // https://developers.google.com/places/web-service/autocomplete
        url.searchParams.append('input', search)
        url.searchParams.append('types', 'address')
        if (Cellular.isoCountryCode) {
          url.searchParams.append(
            'components',
            `country:${Cellular.isoCountryCode}`
          )
          url.searchParams.append('strictbounds', 'true')
        }
        const response = await fetch(url.toString())
        const data = await response.json()
        // TODO: Populate searchResultData
        // setSearchResultData([])
        console.log(data)
      }, 1000),
    [search]
  )

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

  useEffect(() => {
    ;(async () => {
      try {
        delayedFetchAutocomplete()
      } catch (err) {
        addNotification({
          message: err,
          type: 'error'
        })
      }
    })()
  }, [delayedFetchAutocomplete, search, addNotification])

  // Customize header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TextInput
          style={{
            ...styles.headerSearchTextInput,
            color: colors.text
          }}
          onChangeText={(val) => setSearch(val)}
          value={search}
          autoCorrect={false}
          clearButtonMode="always"
          placeholder={t(
            'screen.home.addressLocationSearch.titleSearchTextInput.placeholder'
          )}
          placeholderTextColor={rneTheme.colors?.grey1}
          returnKeyType="done"
          textContentType="streetAddressLine1"
        />
      )
    })
  }, [navigation, search, t])

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
        ...styles.currentLocationItem,
        backgroundColor: rneTheme.colors?.grey5
      }}
    >
      <View style={styles.listItemLeftIconContainer}>
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
    </View>
  )

  const RecentSearchItem = ({ title }: any) => (
    <View style={[styles.listItem, styles.recentSearchItem]}>
      <View style={styles.listItemLeftIconContainer}>
        <MaterialIcons
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
    </View>
  )

  const SearchResultItem = ({ title }: any) => (
    <View style={[styles.listItem, styles.searchResultItem]}>
      <View style={styles.listItemLeftIconContainer}>
        <MaterialIcons
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
    </View>
  )

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {!search ? (
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
                color: rneTheme.colors?.grey2
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
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  headerSearchTextInput: {
    flex: 1
  },
  sectionListHeader: {
    fontSize: 22
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 8,
    paddingVertical: 20,
    opacity: 0.8
  },
  currentLocationItem: {},
  searchHistoryHeaderLine: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  searchHistoryHeaderText: {},
  clearAllButton: {},
  recentSearchItem: {},
  searchResultItem: {},
  listItemMainText: {
    fontSize: listItemFontSize
  },
  listItemLeftIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItemMainContainer: {
    flex: 6,
    justifyContent: 'center'
  }
})

export default LocationSearch
