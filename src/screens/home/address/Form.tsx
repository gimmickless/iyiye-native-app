import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import * as Location from 'expo-location'
import MapView, { LatLng, Marker } from 'react-native-maps'
import { AuthUserAddressKey } from 'types/context'

interface FormProps {
  editAddressKey: AuthUserAddressKey | undefined
  initialLocation: Location.LocationObject
}

const Form: React.FC<FormProps> = (props) => {
  const { editAddressKey, initialLocation } = props
  const [
    currentLocation,
    setCurrentLocation
  ] = useState<Location.LocationObject | null>(null)
  const [markerCoordinate, setMarkerCoordinate] = useState<LatLng>({
    latitude: 0,
    longitude: 0
  })
  const isEdit = !!editAddressKey

  useEffect(() => {
    setCurrentLocation(initialLocation)
    setMarkerCoordinate({
      latitude: initialLocation.coords.latitude ?? 0,
      longitude: initialLocation.coords.longitude ?? 0
    })
  }, [initialLocation])

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
