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
import {
  getHyperlinkTextColor,
  globalAsyncStorageKeyPrefix,
  googlePlaceDetailsBaseUrl,
  googlePlacesAutocompleteBaseUrl,
  linkSuffixIcon,
  listItemPrimaryFontSize,
  listItemSecondaryFontSize,
  locationDelta
} from 'utils/constants'
import { useInAppMessage } from 'contexts/InAppMessage'
import { SearchBar, ThemeContext } from 'react-native-elements'
import { GoogleConfig } from 'config'
import { useDebounce } from 'hooks'
import { Region } from 'react-native-maps'
import OverlayLoader from 'components/shared/OverlayLoader'
import { RootStackParamList } from 'router'
import { ProfileAddressListRouteProps } from './List'
import { ProfileAddressFormRouteProps } from './Form'

const recentLocationSearchesKey = `${globalAsyncStorageKeyPrefix}:recentLocationSearches`

type PlaceAutocompleteResult = {
  placeId: string
  mainText: string
  secondaryText: string
}

type AsyncStorageSearchItem = {
  placeId: string
  mainText: string
}

// check for api reference: https://developers.google.com/maps/documentation/places/web-service/autocomplete
const searchPlaceAsync = async (search: string) => {
  if (!search) return []
  const baseUrl = googlePlacesAutocompleteBaseUrl
  const query = new URLSearchParams({
    key: GoogleConfig.Places.apiKey ?? '',
    input: search,
    types: 'address'
  })
  if (Cellular.isoCountryCode) {
    query.append('components', `country:${Cellular.isoCountryCode}`)
  }
  const endpoint = `${baseUrl}?${query}`
  const response = await fetch(endpoint)
  const data = await response.json()
  if (data.status !== 'OK') {
    throw new Error(`${data.status} - ${data.error_message ?? 'no_message'}`)
  }
  return data.predictions.map(
    (el: any) =>
      ({
        placeId: el.place_id,
        mainText: el.structured_formatting.main_text,
        secondaryText: el.structured_formatting.secondary_text
      } as PlaceAutocompleteResult)
  )
}

// check for api reference: https://developers.google.com/maps/documentation/places/web-service/details
const getPlaceDetailAsync = async (placeId: string) => {
  if (!placeId) return null
  const baseUrl = googlePlaceDetailsBaseUrl
  const query = new URLSearchParams({
    key: GoogleConfig.Places.apiKey ?? '',
    place_id: placeId,
    fields: 'geometry'
  })
  const endpoint = `${baseUrl}?${query}`
  const response = await fetch(endpoint)
  const data = await response.json()
  if (data.status !== 'OK') {
    throw new Error(`${data.status} - ${data.error_message ?? 'no_message'}`)
  }
  //TODO: Check here
  const { lat, lng } = data.result.geometry.location
  return {
    latitude: lat,
    longitude: lng,
    latitudeDelta: locationDelta,
    longitudeDelta: locationDelta
  } as Region
}

const LocationSearch: React.FC = () => {
  const { addInAppMessage } = useInAppMessage()
  const { colors } = useTheme()
  const scheme = useColorScheme()
  const { theme: rneTheme } = useContext(ThemeContext)
  const [recentSearchesData, setRecentSearchesData] = useState<
    AsyncStorageSearchItem[]
  >([])
  const [searchResultData, setSearchResultData] = useState<
    PlaceAutocompleteResult[]
  >([])
  const [isBlockingLoading, setIsBlockingLoading] = useState(false)
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const [searchText, setSearchText] = useState('')
  const debouncedSearchText = useDebounce(searchText, 500)

  const currentLocationData = useMemo(() => {
    return [
      {
        title: t(
          'screen.common.address.locationSearch.quickAccessSectionList.currLocationItem'
        )
      }
    ]
  }, [t])

  useEffect(() => {
    !(async () => {
      try {
        const results = await searchPlaceAsync(debouncedSearchText)
        setSearchResultData(results)
      } catch (err) {
        addInAppMessage({
          message: err,
          type: 'error'
        })
      }
    })()
  }, [addInAppMessage, debouncedSearchText])

  useEffect(() => {
    !(async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(recentLocationSearchesKey)
        const storageDataArray = jsonValue ? JSON.parse(jsonValue) : []
        setRecentSearchesData(storageDataArray)
      } catch (err) {
        addInAppMessage({
          message: err,
          type: 'error'
        })
      }
    })()
  }, [addInAppMessage])

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
            'screen.common.address.locationSearch.titleSearchTextInput.placeholder'
          )}
          returnKeyType="done"
          textContentType="streetAddressLine1"
          cancelButtonTitle={t('common.button.cancel')}
        />
      )
    })
  }, [navigation, rneTheme.colors?.black, searchText, setSearchText, t])

  const addRecentSearch = async (item: AsyncStorageSearchItem) => {
    try {
      setRecentSearchesData((searches) => [...searches, item])
      await AsyncStorage.setItem(
        recentLocationSearchesKey,
        JSON.stringify(recentSearchesData)
      )
    } catch (err) {
      addInAppMessage({
        message: err.message ?? err,
        type: 'error'
      })
    }
  }

  const onSearchResultClick = async (title: string, placeId: string) => {
    setIsBlockingLoading(true)
    await addRecentSearch({
      placeId: placeId,
      mainText: title
    })
    const r = await getPlaceDetailAsync(placeId)
    navigation.navigate(
      'ProfileAddressForm' as keyof RootStackParamList,
      {
        initialRegion: r,
        edit: undefined
      } as ProfileAddressFormRouteProps['params']
    )
    setIsBlockingLoading(false)
  }

  const onRecentSearchClick = async (placeId: string) => {
    setIsBlockingLoading(true)
    const r = await getPlaceDetailAsync(placeId)
    navigation.navigate(
      'ProfileAddressForm' as keyof RootStackParamList,
      {
        initialRegion: r
      } as ProfileAddressFormRouteProps['params']
    )
    setIsBlockingLoading(false)
  }

  const onUseCurrentLocationPress = async () => {
    setIsBlockingLoading(true)
    const { status } = await Location.requestPermissionsAsync()
    if (status !== 'granted') {
      addInAppMessage({
        message: t(
          'screen.common.address.list.message.locationPermissionDenied'
        ),
        type: 'error'
      })
      return
    }
    const { coords } = await Location.getCurrentPositionAsync({})
    navigation.navigate(
      'ProfileAddressForm' as keyof RootStackParamList,
      {
        initialRegion: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: locationDelta,
          longitudeDelta: locationDelta
        }
      } as ProfileAddressFormRouteProps['params']
    )
    setIsBlockingLoading(false)
  }

  const onClearSearchHistory = async () => {
    try {
      await AsyncStorage.setItem(recentLocationSearchesKey, JSON.stringify([]))
      setRecentSearchesData([])
    } catch (err) {
      addInAppMessage({
        message: err.message ?? err,
        type: 'error'
      })
    }
  }

  const CurrentLocationItem = ({ title }: any) => (
    <Pressable
      android_ripple={{ color: 'grey' }}
      onPress={onUseCurrentLocationPress}
    >
      <View
        style={{
          ...styles.listItem,
          ...styles.currentLocationItem
        }}
      >
        <View style={styles.listItemIconContainer}>
          <MaterialIcons
            name="my-location"
            size={listItemPrimaryFontSize}
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
            size={listItemPrimaryFontSize}
            color={colors.text}
          />
        </View>
      </View>
    </Pressable>
  )

  const RecentSearchItem = ({ title, placeId }: any) => (
    <Pressable
      android_ripple={{ color: 'grey' }}
      onPress={() => onRecentSearchClick(placeId)}
    >
      <View style={[styles.listItem, styles.recentSearchItem]}>
        <View style={styles.listItemIconContainer}>
          <MaterialCommunityIcons
            name="history"
            size={listItemPrimaryFontSize}
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
            size={listItemPrimaryFontSize}
            color={colors.text}
          />
        </View>
      </View>
    </Pressable>
  )

  const SearchResultItem = ({ title, detail, placeId }: any) => (
    <Pressable
      android_ripple={{ color: 'grey' }}
      onPress={() => onSearchResultClick(title, placeId)}
    >
      <View style={[styles.listItem, styles.searchResultItem]}>
        <View style={styles.listItemIconContainer}>
          <MaterialCommunityIcons
            name="map-search"
            size={listItemPrimaryFontSize}
            color={colors.text}
          />
        </View>
        <View style={styles.listItemMainContainer}>
          <Text style={{ ...styles.listItemMainText, color: colors.text }}>
            {title}
          </Text>
          <Text style={{ ...styles.listItemDetailText, color: colors.text }}>
            {detail}
          </Text>
        </View>
        <View style={styles.listItemIconContainer}>
          <MaterialCommunityIcons
            name="arrow-right"
            size={listItemPrimaryFontSize}
            color={colors.text}
          />
        </View>
      </View>
    </Pressable>
  )

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <OverlayLoader loading={isBlockingLoading} type="location" />
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
                'screen.common.address.locationSearch.quickAccessSectionList.listTitle.recents'
              )}
            </Text>
            <Text
              style={{
                ...styles.clearAllButton,
                color: getHyperlinkTextColor(scheme === 'dark')
              }}
              onPress={onClearSearchHistory}
            >
              {t(
                'screen.common.address.locationSearch.quickAccessSectionList.button.clearHistory'
              )}
              &nbsp;{linkSuffixIcon}
            </Text>
          </View>
          <FlatList
            data={recentSearchesData}
            renderItem={({ item }) => (
              <RecentSearchItem title={item.mainText} placeId={item.placeId} />
            )}
            keyExtractor={(_item, index) => `${index}`}
          />
        </React.Fragment>
      ) : (
        <FlatList
          data={searchResultData}
          renderItem={({ item }) => (
            <SearchResultItem
              title={item.mainText}
              detail={item.secondaryText}
              placeId={item.placeId}
            />
          )}
          keyExtractor={(item) => item.placeId}
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
    fontSize: listItemPrimaryFontSize
  },
  listItemDetailText: {
    fontSize: listItemSecondaryFontSize
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
