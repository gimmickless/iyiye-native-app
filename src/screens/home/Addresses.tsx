import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { Text } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { AuthUserContext } from 'contexts/Auth'
import { LocalizationContext } from 'contexts/Localization'
import LoadingView from 'components/shared/LoadingView'
import { FlatList } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Location from 'expo-location'
import { useToast } from 'react-native-styled-toast'
import MapView, { LatLng, Marker } from 'react-native-maps'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

enum AddressTypes {
  CurrentLocation = 'currentLocation',
  Default = 'default',
  AltAddress1 = 'altAddress1',
  AltAddress2 = 'altAddress2',
  AltAddress3 = 'altAddress3',
  AltAddress4 = 'altAddress4',
  AltAddress5 = 'altAddress5'
}

const Addresses: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const { toast } = useToast()
  const { state: authUser } = useContext(AuthUserContext)
  const [
    currentLocation,
    setCurrentLocation
  ] = useState<Location.LocationObject | null>(null)
  const [markerCoordinate, setMarkerCoordinate] = useState<LatLng>({
    latitude: 0,
    longitude: 0
  })
  const [upsertAddressModal, setUpsertAddressModal] = useState(false)
  const [selectedKey, setSelectedKey] = useState('')

  const addresses = useMemo(
    () => [
      {
        key: AddressTypes.CurrentLocation,
        value: t('screen.home.addresses.list.currentLocation. title')
      },
      { key: AddressTypes.Default, value: authUser.props?.address },
      { key: AddressTypes.AltAddress1, value: authUser.props?.altAddress1 },
      { key: AddressTypes.AltAddress2, value: authUser.props?.altAddress2 },
      { key: AddressTypes.AltAddress3, value: authUser.props?.altAddress3 },
      { key: AddressTypes.AltAddress4, value: authUser.props?.altAddress4 },
      { key: AddressTypes.AltAddress5, value: authUser.props?.altAddress5 }
    ],
    [authUser, t]
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          <Item
            onPress={() => setUpsertAddressModal(false)}
            title={t('screen.home.addresses.button.create')}
          />
        </HeaderButtons>
      )
    })
  }, [navigation, t])

  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestPermissionsAsync()
      if (status !== 'granted') {
        toast({
          message: t('screen.home.addresses.message.locationPermissionDenied'),
          intent: 'ERROR',
          duration: 0
        })
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      setCurrentLocation(location)
      setMarkerCoordinate({
        latitude: location.coords.latitude ?? 0,
        longitude: location.coords.longitude ?? 0
      })
    })()
  }, [t, toast])

  return !authUser.loaded ? (
    <LoadingView />
  ) : (
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
      <FlatList
        style={styles.listContainer}
        data={addresses}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelectedKey(item.key)}
            style={
              item.key === selectedKey
                ? { ...styles.listItem, ...styles.selectedListItem }
                : { ...styles.listItem, ...styles.unselectedListItem }
            }
          >
            <Text h4>Asddsa</Text>
          </Pressable>
        )}
        keyExtractor={(item) => item.key}
        extraData={selectedKey}
      />
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
  },
  listContainer: { paddingHorizontal: 8 },
  listItem: {},
  selectedListItem: {},
  unselectedListItem: {}
})

export default Addresses
