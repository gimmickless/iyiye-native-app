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
  TextInput
} from 'react-native'
import { debounce } from 'debounce'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useToast } from 'react-native-styled-toast'
import { LocalizationContext } from 'contexts/Localization'
import { useNavigation } from '@react-navigation/native'
import { HomeStackScreenNames } from 'types/route'
import {
  globalAsyncStorageKeyPrefix,
  googlePlacesAutocompleteBaseUrl
} from 'utils/constants'

const recentLocationSearchesKey = `${globalAsyncStorageKeyPrefix}:recentLocationSearches`

const LocationSearch: React.FC = () => {
  const [search, setSearch] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const { toast } = useToast()

  const delayedFetchAutocomplete = useMemo(
    () =>
      debounce(async () => {
        let url = googlePlacesAutocompleteBaseUrl
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
        toast({
          message: err,
          intent: 'ERROR',
          duration: 0
        })
      }
    })()
  }, [toast])

  useEffect(() => {
    ;(async () => {
      try {
        delayedFetchAutocomplete()
      } catch (err) {
        toast({
          message: err,
          intent: 'ERROR',
          duration: 0
        })
      }
    })()
  }, [delayedFetchAutocomplete, search, toast])

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
      toast({
        message: err.message ?? err,
        intent: 'ERROR',
        duration: 0
      })
    }
  }

  const onUseCurrentLocationPress = async () => {
    let { status } = await Location.requestPermissionsAsync()
    if (status !== 'granted') {
      toast({
        message: t('screen.home.addressList.message.locationPermissionDenied'),
        intent: 'ERROR',
        duration: 0
      })
      return
    }
    let location = await Location.getCurrentPositionAsync({})
    navigation.navigate(HomeStackScreenNames.AddressForm, location)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      asd
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
