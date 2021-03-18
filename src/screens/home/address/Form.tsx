import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import * as Location from 'expo-location'
import MapView, { LatLng, Marker } from 'react-native-maps'
import { AuthUserAddressKey } from 'types/context'
import { RouteProp, useRoute } from '@react-navigation/native'
import { HomeStackParamList } from 'router/stacks/Home'

export type HomeAddressFormRouteProps = RouteProp<
  HomeStackParamList,
  'HomeAddressForm'
>

const Form: React.FC = () => {
  const route = useRoute<HomeAddressFormRouteProps>()
  console.log('Route Params: ' + JSON.stringify(route.params))
  const initialMarkerPosition = route.params?.initialMarkerPosition
  const editObject = route.params?.editObject
  // const { initialMarkerPosition, editObject } = params
  const [
    currentLocation,
    setCurrentLocation
  ] = useState<Location.LocationObject | null>(null)
  const [markerCoordinate, setMarkerCoordinate] = useState<LatLng | undefined>({
    latitude: 0,
    longitude: 0
  })
  const isEdit = !!editObject

  useEffect(() => {
    setCurrentLocation({
      coords: {
        latitude: initialMarkerPosition?.latitude ?? 0,
        longitude: initialMarkerPosition?.longitude ?? 0,
        accuracy: null,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
      },
      timestamp: 0
    })
    setMarkerCoordinate(initialMarkerPosition)
  }, [initialMarkerPosition])

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: currentLocation?.coords.latitude ?? 0,
          longitude: currentLocation?.coords.longitude ?? 0,
          latitudeDelta: 0,
          longitudeDelta: 0
        }}
        region={{
          latitude: currentLocation?.coords.latitude ?? 0,
          longitude: currentLocation?.coords.longitude ?? 0,
          latitudeDelta: 0,
          longitudeDelta: 0
        }}
      >
        <Marker
          coordinate={markerCoordinate as LatLng}
          onDragEnd={(e) => setMarkerCoordinate(e.nativeEvent.coordinate)}
        />
      </MapView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  map: {
    height: 200
  }
})

export default Form
