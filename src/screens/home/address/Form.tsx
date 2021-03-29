import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'
import {
  StyleSheet,
  View,
  Image,
  Alert,
  NativeSyntheticEvent,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native'
import { GoogleConfig } from 'config'
import MapView, { LatLng, Region } from 'react-native-maps'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { HomeStackParamList } from 'router/stacks/Home'
import { Button, Input, ThemeContext, Card } from 'react-native-elements'
import SegmentedControl, {
  NativeSegmentedControlIOSChangeEvent
} from '@react-native-community/segmented-control'
import { LocalizationContext } from 'contexts/Localization'
import { useInAppNotification } from 'contexts/InAppNotification'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
  googleMapsAddressComponentStreetNumberType,
  googlePlaceGeocodingBaseUrl
} from 'utils/constants'
import { HomeStackScreenNames } from 'types/route'
import { AuthUserContext } from 'contexts/Auth'
import {
  AuthUserAddress,
  AuthUserAddressKey,
  AuthUserState,
  UpdateAddressesInput
} from 'types/context'
import { AddressSlotFullError } from 'types/customError'

export type HomeAddressFormRouteProps = RouteProp<
  HomeStackParamList,
  'HomeAddressForm'
>

type PlaceReverseGeocodingResult = {
  placeId: string
  addressLine: string
  addressComponents: {
    short_name: string
    long_name: string
    postcode_localities: string[]
    types: string[]
  }[]
}

const mapHeight = 250

const defaultAddressKind: AuthUserAddress['kind'] = 'other'

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

  if (data.status !== 'OK') {
    throw new Error(`${data.status} - ${data.error_message ?? 'no_message'}`)
  }
  if (!data.results || !data.results.length) {
    throw new Error(
      `no reverse geocoding results found for ${latLng.latitude},${latLng.longitude}`
    )
  }
  const firstResult = data.results[0]

  return {
    placeId: firstResult.place_id,
    addressLine: firstResult.formatted_address,
    addressComponents: firstResult.address_components
  } as PlaceReverseGeocodingResult
}

const getNewAddressContextInput = (
  authUserProps: AuthUserState['props'],
  newAddress: AuthUserAddress
) => {
  if (authUserProps?.address5) {
    throw new AddressSlotFullError()
  }
  if (authUserProps?.address4) {
    return {
      address1: authUserProps.address1,
      address2: authUserProps.address2,
      address3: authUserProps.address3,
      address4: authUserProps.address4,
      address5: newAddress
    } as UpdateAddressesInput
  }
  if (authUserProps?.address3) {
    return {
      address1: authUserProps.address1,
      address2: authUserProps.address2,
      address3: authUserProps.address3,
      address4: newAddress
    } as UpdateAddressesInput
  }
  if (authUserProps?.address2) {
    return {
      address1: authUserProps.address1,
      address2: authUserProps.address2,
      address3: newAddress
    } as UpdateAddressesInput
  }
  if (authUserProps?.address1) {
    return {
      address1: authUserProps.address1,
      address2: newAddress
    } as UpdateAddressesInput
  }
  return {
    address1: newAddress
  } as UpdateAddressesInput
}

const getAddressObject = (
  authUserProps: AuthUserState['props'],
  key: AuthUserAddressKey
) => {
  if (key === 'address1') {
    return authUserProps?.address1
  }
  if (key === 'address2') {
    return authUserProps?.address2
  }
  if (key === 'address3') {
    return authUserProps?.address3
  }
  if (key === 'address4') {
    return authUserProps?.address4
  }
  if (key === 'address5') {
    return authUserProps?.address5
  }
  return undefined
}

const Form: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const { state: authUser, action: authUserAction } = useContext(
    AuthUserContext
  )
  const { addNotification } = useInAppNotification()
  const navigation = useNavigation()
  const route = useRoute<HomeAddressFormRouteProps>()
  const initialRegion = route.params?.initialRegion
  const editObject = route.params?.edit

  const { theme: rneTheme } = useContext(ThemeContext)
  const [saveLoading, setSaveLoading] = useState(false)
  const [regionChangeInProgress, setRegionChangeInProgress] = useState(false)
  const [hasRegionChanged, setHasRegionChanged] = useState(false)
  const [region, setRegion] = useState<Region | undefined>(initialRegion)
  const [selectedAddressKindIndex, setSelectedAddressKindIndex] = useState<
    number | undefined
  >(undefined)
  const [
    mapComputedAddress,
    setMapComputedAddress
  ] = useState<PlaceReverseGeocodingResult>()

  const [fineTuningStreetNumber, setFineTuningStreetNumber] = useState<
    string | undefined
  >(undefined)

  const [fineTuningFlatNumber, setFineTuningFlatNumber] = useState<
    number | undefined
  >(undefined)

  const [fineTuningFloor, setFineTuningFloor] = useState<number | undefined>(
    undefined
  )

  const [addressDirections, setAddressDirections] = useState('')

  const addressKindList: Array<{
    value: AuthUserAddress['kind']
    text: string
  }> = useMemo(
    () => [
      {
        value: 'home',
        text: t('screen.home.addressForm.segmentedControl.addressType.home')
      },
      {
        value: 'office',
        text: t('screen.home.addressForm.segmentedControl.addressType.office')
      },
      {
        value: 'other',
        text: t('screen.home.addressForm.segmentedControl.addressType.other')
      }
    ],
    [t]
  )

  const isEdit = !!editObject

  useEffect(() => {
    !(async () => {
      try {
        let initialLatLng: LatLng
        if (isEdit) {
          const editAddressObj = getAddressObject(
            authUser.props,
            editObject?.key
          )
          initialLatLng = {
            latitude: editAddressObj?.latitude ?? 0,
            longitude: editAddressObj?.longitude ?? 0
          }
          setFineTuningStreetNumber(editAddressObj?.streetNumber)
          setFineTuningFlatNumber(editAddressObj?.flatNumber)
          setFineTuningFloor(editAddressObj?.floor)
          setSelectedAddressKindIndex(
            addressKindList.findIndex(
              (el) =>
                el.value ===
                (isEdit ? editAddressObj?.kind : defaultAddressKind)
            )
          )
        } else {
          initialLatLng = {
            latitude: region?.latitude ?? 0,
            longitude: region?.longitude ?? 0
          }
        }
        const reverseGeocodingResult = await getReverseGeocodingAsync(
          initialLatLng
        )
        setMapComputedAddress(reverseGeocodingResult)
        const computedStreetNumber = reverseGeocodingResult?.addressComponents.find(
          (x) => x.types.includes(googleMapsAddressComponentStreetNumberType)
        )?.short_name
        setFineTuningStreetNumber(computedStreetNumber)
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

  const onSave = useCallback(async () => {
    setSaveLoading(true)
    try {
      //TODO: Implement Save
      const input = getNewAddressContextInput(authUser.props, {
        kind: selectedAddressKindIndex
          ? addressKindList[selectedAddressKindIndex].value
          : 'other',
        latitude: region?.latitude ?? 0,
        longitude: region?.longitude ?? 0,
        streetAddress: mapComputedAddress?.addressLine ?? '',
        streetNumber: fineTuningStreetNumber ?? '',
        flatNumber: fineTuningFlatNumber ?? 0,
        floor: fineTuningFloor ?? 0,
        directions: addressDirections
      })
      await authUserAction.updateAddresses(input)
      navigation.navigate(HomeStackScreenNames.AddressList, {
        changedAddressKey: editObject?.key
      })
    } catch (err) {
      if (err instanceof AddressSlotFullError) {
        Alert.alert(
          t('screen.home.addressForm.alert.addressSlotFull.title'),
          t('screen.home.addressForm.alert.addressSlotFull.message', {
            maxAddressCount: 5
          }),
          [
            {
              text: t('common.button.cancel'),
              onPress: () => {
                return
              },
              style: 'cancel'
            },
            {
              text: t(
                'screen.home.addressForm.alert.addressSlotFull.button.backToList'
              ),
              onPress: () => {
                navigation.navigate(HomeStackScreenNames.AddressList)
              },
              style: 'cancel'
            }
          ],
          {
            cancelable: true
          }
        )
        return
      }
      addNotification({
        message: err,
        type: 'error'
      })
    } finally {
      setSaveLoading(false)
    }
  }, [
    addNotification,
    addressDirections,
    addressKindList,
    authUser.props,
    authUserAction,
    editObject?.key,
    fineTuningFlatNumber,
    fineTuningFloor,
    fineTuningStreetNumber,
    mapComputedAddress?.addressLine,
    navigation,
    region?.latitude,
    region?.longitude,
    selectedAddressKindIndex,
    t
  ])

  // Customize header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: !isEdit
        ? t('screen.home.addressForm.title.new')
        : t('screen.home.addressForm.title.edit', {
            addressKey: editObject?.key
          }),
      headerRight: () => (
        <Button
          type="clear"
          icon={
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={15}
              color={rneTheme.colors?.primary}
            />
          }
          title={t('common.button.save')}
          onPress={onSave}
          loading={saveLoading}
          disabled={saveLoading}
        />
      )
    })
  }, [
    editObject?.key,
    isEdit,
    navigation,
    onSave,
    rneTheme.colors?.primary,
    saveLoading,
    t
  ])

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
      const computedStreetNumber = reverseGeocodingResult?.addressComponents.find(
        (x) => x.types.includes(googleMapsAddressComponentStreetNumberType)
      )?.short_name
      setFineTuningStreetNumber(computedStreetNumber)
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
    <KeyboardAvoidingView behavior="position" style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
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
        <View style={styles.horizontalMarginContainerView}>
          <Button
            style={styles.blockButton}
            onPress={calculateAddressLine}
            title={t('screen.home.addressForm.button.updateWithThisLocation')}
            disabled={!hasRegionChanged}
          />
        </View>

        <Input
          label={t('screen.home.addressForm.label.addressLine')}
          value={mapComputedAddress?.addressLine}
          containerStyle={styles.addressBoxContainer}
          textContentType="fullStreetAddress"
          editable={false}
          multiline
        />
        <View style={styles.horizontalMarginContainerView}>
          <SegmentedControl
            values={addressKindList.map((x) => x.text)}
            selectedIndex={selectedAddressKindIndex}
            onChange={(
              event: NativeSyntheticEvent<NativeSegmentedControlIOSChangeEvent>
            ) => {
              setSelectedAddressKindIndex(
                event.nativeEvent.selectedSegmentIndex
              )
            }}
          />
        </View>

        <Card containerStyle={styles.fineTuningCard}>
          <Card.Title h4Style={{ color: rneTheme.colors?.grey1 }}>
            {t(
              'screen.home.addressForm.title.section.fineTuning'
            ).toLocaleUpperCase()}
          </Card.Title>
          <Card.Divider />
          <View style={styles.fineTuningInputFormContainer}>
            <Input
              label={t('screen.home.addressForm.label.fineTuning.streetNumber')}
              containerStyle={styles.fineTuningInputContainer}
              value={fineTuningStreetNumber}
              onChangeText={(val) => setFineTuningStreetNumber(val)}
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="default"
            />
            <Input
              label={t('screen.home.addressForm.label.fineTuning.flatNumber')}
              containerStyle={styles.fineTuningInputContainer}
              value={fineTuningFlatNumber ? `${fineTuningFlatNumber}` : ''}
              onChangeText={(val) => setFineTuningFlatNumber(parseInt(val, 10))}
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="number-pad"
            />
            <Input
              label={t('screen.home.addressForm.label.fineTuning.floor')}
              containerStyle={styles.fineTuningInputContainer}
              value={fineTuningFloor ? `${fineTuningFloor}` : ''}
              onChangeText={(val) => setFineTuningFloor(parseInt(val, 10))}
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="number-pad"
            />
            <Input
              label={t('screen.home.addressForm.label.addressDirections')}
              value={addressDirections}
              onChangeText={(val) => setAddressDirections(val)}
              inputStyle={styles.addressDirectionsInput}
              textContentType="none"
              multiline
              numberOfLines={2}
            />
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {},
  headerRightButtonText: {},
  fineTuningCard: {
    marginHorizontal: 0,
    borderWidth: 0,
    elevation: 0
  },
  map: {
    height: mapHeight,
    marginBottom: 12
  },
  horizontalMarginContainerView: {
    marginHorizontal: 12
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
  blockButton: {},
  addressBoxContainer: {
    marginTop: 12
  },
  fineTuningSectionHeader: {
    fontSize: 12
  },
  fineTuningInputFormContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  fineTuningInputContainer: {
    flex: 1
  },
  addressDirectionsInput: {}
})

export default Form
