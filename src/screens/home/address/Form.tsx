import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, View, Image } from 'react-native'
import * as Location from 'expo-location'
import MapView, { LatLng, Region } from 'react-native-maps'
import { RouteProp, useRoute } from '@react-navigation/native'
import { HomeStackParamList } from 'router/stacks/Home'
import { Button, Input } from 'react-native-elements'
import { LocalizationContext } from 'contexts/Localization'
import { useInAppNotification } from 'contexts/InAppNotification'
import { GoogleConfig } from 'config'
import { googlePlaceGeocodingBaseUrl } from 'utils/constants'

export type HomeAddressFormRouteProps = RouteProp<
  HomeStackParamList,
  'HomeAddressForm'
>

type PlaceReverseGeocodingResult = {
  placeId: string
  addressLine: string
}

const mapHeight = 250

// check for api reference: https://developers.google.com/maps/documentation/geocoding/overview#ReverseGeocoding
const getReverseGeocodingAsync = async (latLng: LatLng) => {
  if (!latLng) return undefined
  const baseUrl = googlePlaceGeocodingBaseUrl
  const query = new URLSearchParams({
    key: GoogleConfig.Places.apiKey ?? '',
    latlng: `${latLng.latitude},${latLng.longitude}`,
    result_type: 'street_address',
    location_type: 'ROOFTOP'
  })
  const endpoint = `${baseUrl}?${query}`
  const response = await fetch(endpoint)
  const data = await response.json()
  console.log('reverse geocode result: ' + data)
  if (data.status !== 'OK') {
    throw new Error(`${data.status} - ${data.error_message ?? 'no_message'}`)
  }
  if (!data.results || !data.results.length) {
    throw new Error(
      `no reverse geocoding results found for ${latLng.latitude},${latLng.longitude}`
    )
  }

  return data.results[0].map(
    (el: any) =>
      ({
        placeId: el.place_id,
        addressLine: el.formatted_address
      } as PlaceReverseGeocodingResult)
  )
}

const Form: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const { addNotification } = useInAppNotification()
  const route = useRoute<HomeAddressFormRouteProps>()
  const initialRegion = route.params?.initialRegion
  const editObject = route.params?.editObject

  const [regionChangeInProgress, setRegionChangeInProgress] = useState<boolean>(
    false
  )
  const [hasRegionChanged, setHasRegionChanged] = useState<boolean>(false)
  const [region, setRegion] = useState<Region | undefined>(initialRegion)
  const [
    mapComputedAddress,
    setMapComputedAddress
  ] = useState<PlaceReverseGeocodingResult>()

  const isEdit = !!editObject

  useEffect(() => {
    ;(async () => {
      try {
        const reverseGeocodingResult = await getReverseGeocodingAsync({
          latitude: region?.latitude ?? 0,
          longitude: region?.longitude ?? 0
        })
        setMapComputedAddress(reverseGeocodingResult)
      } catch (err) {
        addNotification({
          message: err,
          type: 'error'
        })
      }
    })()
    // No Deps to ensure it is performed only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onRegionChangeComplete = (r: Region) => {
    setRegionChangeInProgress(false)
    setHasRegionChanged(true)
    setRegion(r)
  }

  const calculateAddressLine = async () => {
    try {
      const reverseGeocodingResult = await getReverseGeocodingAsync({
        latitude: region?.latitude ?? 0,
        longitude: region?.longitude ?? 0
      })
      setMapComputedAddress(reverseGeocodingResult)
    } catch (err) {
      addNotification({
        message: err,
        type: 'error'
      })
    } finally {
      setHasRegionChanged(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChange={() => setRegionChangeInProgress(true)}
        onRegionChangeComplete={(r) => onRegionChangeComplete(r)}
      />
      <View style={styles.markerFixed}>
        <Image
          style={styles.marker}
          source={
            !regionChangeInProgress
              ? require('visuals/map-marker.png')
              : require('visuals/map-marker-animated.gif')
          }
        />
      </View>
      <Button
        style={styles.blockButton}
        onPress={calculateAddressLine}
        title={t('screen.home.addressForm.button.useLocation')}
        disabled={!hasRegionChanged}
      />
      <Input
        disabled
        placeholder={t('screen.home.addressForm.label.addressLine')}
        value={mapComputedAddress?.addressLine}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    height: mapHeight,
    marginBottom: 12
  },

  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: mapHeight / 2
  },
  marker: {
    height: 48,
    width: 48
  },
  blockButton: {
    marginHorizontal: 12
  }
})

export default Form
