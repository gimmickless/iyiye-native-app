import React, { useContext, useEffect, useState } from 'react'
import * as Location from 'expo-location'
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useToast } from 'react-native-styled-toast'
import { LocalizationContext } from 'contexts/Localization'
import { useNavigation } from '@react-navigation/native'
import { HomeStackScreenNames } from 'types/route'
import { globalAsyncStorageKeyPrefix } from 'utils/constants'

const recentLocationSearchesKey = `${globalAsyncStorageKeyPrefix}:recentLocationSearches`

const LocationSearch: React.FC = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const { toast } = useToast()

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
  }
})

export default LocationSearch
