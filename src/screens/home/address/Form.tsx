import React, { useContext, useState } from 'react'
import { SafeAreaView, StyleSheet, View, Image } from 'react-native'
import * as Location from 'expo-location'
import MapView, { Region } from 'react-native-maps'
import { RouteProp, useRoute } from '@react-navigation/native'
import { HomeStackParamList } from 'router/stacks/Home'
import { Button } from 'react-native-elements'
import { LocalizationContext } from 'contexts/Localization'
import { useInAppNotification } from 'contexts/InAppNotification'

export type HomeAddressFormRouteProps = RouteProp<
  HomeStackParamList,
  'HomeAddressForm'
>

const mapHeight = 250

const Form: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const { addNotification } = useInAppNotification()
  const route = useRoute<HomeAddressFormRouteProps>()
  console.log('Route Params: ' + JSON.stringify(route.params))
  const initialRegion = route.params?.initialRegion
  const editObject = route.params?.editObject

  const [regionChangeInProgress, setRegionChangeInProgress] = useState<boolean>(
    false
  )
  const [hasRegionChanged, setHasRegionChanged] = useState<boolean>(false)
  const [region, setRegion] = useState<Region | undefined>(initialRegion)

  const isEdit = !!editObject

  const onRegionChangeComplete = (r: Region) => {
    setRegionChangeInProgress(false)
    setHasRegionChanged(true)
    setRegion(r)
  }

  const onUseCurrentRegionClick = () => {
    try {
      // TODO: Fetch details of region from Google Geocode
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
        onPress={onUseCurrentRegionClick}
        title={t('screen.home.addressForm.button.useLocation')}
        disabled={!hasRegionChanged}
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
    marginBottom: 12
  }
})

export default Form
