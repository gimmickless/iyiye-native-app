import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'
import * as Location from 'expo-location'
import * as Cellular from 'expo-cellular'
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  SectionList,
  View,
  Text,
  SectionListData,
  FlatList,
  DefaultSectionT
} from 'react-native'
import { debounce } from 'debounce'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LocalizationContext } from 'contexts/Localization'
import { useNavigation } from '@react-navigation/native'
import { HomeStackScreenNames } from 'types/route'
import {
  globalAsyncStorageKeyPrefix,
  googlePlacesAutocompleteBaseUrl
} from 'utils/constants'
import { useInAppNotification } from 'contexts/InAppNotification'
import { ThemeContext } from 'react-native-elements'

const recentLocationSearchesKey = `${globalAsyncStorageKeyPrefix}:recentLocationSearches`

const LocationSearch: React.FC = () => {
  const { addNotification } = useInAppNotification()
  const { theme: rneTheme } = useContext(ThemeContext)
  const [search, setSearch] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [quickAccessData, setQuickAccessData] = useState<any[]>([])
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

  useEffect(() => {
    ;(async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(recentLocationSearchesKey)
        setRecentSearches(jsonValue ? JSON.parse(jsonValue) : [])
      } catch (err) {
        addNotification({
          message: err,
          type: 'error'
        })
      }
    })()
  }, [addNotification])

  useEffect(() => {
    setQuickAccessData([
      {
        title: '',
        data: [
          t(
            'screen.home.addressLocationSearch.quickAccessSectionList.currLocationItem'
          )
        ]
      },
      {
        title: t(
          'screen.home.addressLocationSearch.quickAccessSectionList.recentsTitle'
        ),
        data: [recentSearches]
      }
    ])
  }, [recentSearches, t])

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
      // headerStyle: { elevation: 0, shadowOpacity: 0 },
      headerTitle: () => (
        <TextInput
          style={styles.headerSearchTextInput}
          onChangeText={(val) => setSearch(val)}
          value={search}
          autoCorrect={false}
          clearButtonMode="always"
          placeholder={t(
            'screen.home.addressLocationSearch.titleSearchTextInput.placeholder'
          )}
          returnKeyType="done"
          textContentType="streetAddressLine1"
        />
      )
    })
  }, [navigation, search, t])

  const addRecentSearch = async (val: string) => {
    try {
      setRecentSearches((searches) => [...searches, val])
      await AsyncStorage.setItem(
        recentLocationSearchesKey,
        JSON.stringify(recentSearches)
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

  const QuickAccessItem = ({ title }: any) => (
    <View style={styles.quickAccessItem}>
      <Text style={styles.quickAccessItemText}>{title}</Text>
    </View>
  )

  const SearchResultItem = ({ title }: any) => (
    <View style={styles.searchResultItem}>
      <Text style={styles.searchResultItemText}>{title}</Text>
    </View>
  )

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {!search ? (
        <SectionList
          sections={quickAccessData}
          renderSectionHeader={({ section: { title } }) => (
            <Text
              style={{
                ...styles.sectionListHeader,
                color: rneTheme.colors?.grey1
              }}
            >
              {title}
            </Text>
          )}
          renderItem={({ item }) => <QuickAccessItem title={item} />}
          keyExtractor={(item, index) => item + index}
        />
      ) : (
        <FlatList
          data={searchResultData}
          renderItem={({ item }) => <SearchResultItem title={item} />}
          keyExtractor={(item) => item.id}
        />
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  headerSearchTextInput: {
    flex: 1
  },
  sectionListHeader: {
    fontSize: 22
  },
  quickAccessItem: {
    padding: 20,
    marginVertical: 8
  },
  searchResultItem: {
    padding: 20,
    marginVertical: 8
  },
  quickAccessItemText: {},
  searchResultItemText: {}
})

export default LocationSearch
