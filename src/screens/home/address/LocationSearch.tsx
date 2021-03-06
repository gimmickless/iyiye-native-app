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
  Text
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

const recentLocationSearchesKey = `${globalAsyncStorageKeyPrefix}:recentLocationSearches`

const LocationSearch: React.FC = () => {
  const { addNotification } = useInAppNotification()
  const [search, setSearch] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text>asd</Text>
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
  }
})

export default LocationSearch
