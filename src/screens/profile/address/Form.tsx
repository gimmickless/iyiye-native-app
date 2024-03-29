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
import { Button, Input, ThemeContext, Card } from 'react-native-elements'
import SegmentedControl, {
  NativeSegmentedControlIOSChangeEvent
} from '@react-native-community/segmented-control'
import { LocalizationContext } from 'contexts/Localization'
import { useInAppMessage } from 'contexts/InAppMessage'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { googlePlaceGeocodingBaseUrl } from 'utils/constants'
import { AuthUserContext } from 'contexts/Auth'
import {
  AuthUserAddress,
  AuthUserAddressKey,
  AuthUserState,
  UpdateAddressesInput
} from 'types/context'
import { AddressSlotFullError } from 'types/customError'
import { RootStackParamList } from 'router'

export type ProfileAddressFormRouteProps = RouteProp<
  RootStackParamList,
  'ProfileAddressForm'
>

type PlaceReverseGeocodingResult = {
  placeId: string
  routeAddressLine: string
  streetNumber: string
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
    result_type: 'street_address|route',
    location_type: 'ROOFTOP|GEOMETRIC_CENTER'
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
  const firstStreetAddressLevelResult = data.results.find((x: any) =>
    x.types.includes('street_address')
  )
  const firstRouteLevelResult = data.results.find((x: any) =>
    x.types.includes('route')
  )

  return {
    placeId: firstStreetAddressLevelResult.place_id,
    routeAddressLine: firstRouteLevelResult.formatted_address,
    streetNumber: firstStreetAddressLevelResult.address_components.find(
      (x: any) => x.types.includes('street_number')
    ).short_name
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
  const { state: authUser, action: authUserAction } =
    useContext(AuthUserContext)
  const { addInAppMessage } = useInAppMessage()
  const navigation = useNavigation()
  const route = useRoute<ProfileAddressFormRouteProps>()
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
  const [mapComputedAddress, setMapComputedAddress] =
    useState<PlaceReverseGeocodingResult>()

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
        text: t('screen.common.address.form.segmentedControl.addressType.home')
      },
      {
        value: 'office',
        text: t(
          'screen.common.address.form.segmentedControl.addressType.office'
        )
      },
      {
        value: 'other',
        text: t('screen.common.address.form.segmentedControl.addressType.other')
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
            addressKindList.findIndex((el) => el.value === editAddressObj?.kind)
          )
        } else {
          initialLatLng = {
            latitude: region?.latitude ?? 0,
            longitude: region?.longitude ?? 0
          }
          setSelectedAddressKindIndex(
            addressKindList.findIndex((el) => el.value === defaultAddressKind)
          )
        }
        const reverseGeocodingResult = await getReverseGeocodingAsync(
          initialLatLng
        )
        setMapComputedAddress(reverseGeocodingResult)
        setFineTuningStreetNumber(reverseGeocodingResult?.streetNumber)
      } catch (err) {
        addInAppMessage({
          message: err,
          type: 'error'
        })
      }
    })()
    // No Deps to ensure it is performed only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSave = useCallback(async () => {
    if (!fineTuningStreetNumber) {
      addInAppMessage({
        message: t(
          'screen.common.address.form.message.streetNumberCannotBeEmpty'
        ),
        type: 'error'
      })
      return
    }
    setSaveLoading(true)
    try {
      const input = getNewAddressContextInput(authUser.props, {
        kind: selectedAddressKindIndex
          ? addressKindList[selectedAddressKindIndex].value
          : 'other',
        latitude: region?.latitude ?? 0,
        longitude: region?.longitude ?? 0,
        routeAddress: mapComputedAddress?.routeAddressLine ?? '',
        streetNumber: fineTuningStreetNumber ?? '',
        flatNumber: fineTuningFlatNumber ?? 0,
        floor: fineTuningFloor ?? 0,
        directions: addressDirections
      })
      await authUserAction.updateAddresses(input)
      if (isEdit) {
        navigation.navigate('ProfileAddressList' as keyof RootStackParamList, {
          changedAddressKey: editObject?.key
        })
      } else {
        const createdAddressKey = Object.keys(input).sort(() => 1)[0]
        await authUserAction.update({
          ...authUser.props,
          fullName: authUser.props?.fullName ?? '',
          address: createdAddressKey as AuthUserAddressKey
        })
        navigation.navigate('ProfileAddressList' as keyof RootStackParamList, {
          changedAddressKey: Object.keys(input).sort(() => 1)[0]
        })
      }
      navigation.navigate('ProfileAddressList' as keyof RootStackParamList, {
        changedAddressKey: isEdit
          ? editObject?.key
          : Object.keys(input).sort(() => 1)[0]
      })
    } catch (err) {
      if (err instanceof AddressSlotFullError) {
        Alert.alert(
          t('screen.common.address.form.alert.addressSlotFull.title'),
          t('screen.common.address.form.alert.addressSlotFull.message', {
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
                'screen.common.address.form.alert.addressSlotFull.button.backToList'
              ),
              onPress: () => {
                navigation.navigate(
                  'ProfileAddressList' as keyof RootStackParamList
                )
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
      addInAppMessage({
        message: err,
        type: 'error'
      })
    } finally {
      setSaveLoading(false)
    }
  }, [
    addInAppMessage,
    addressDirections,
    addressKindList,
    authUser.props,
    authUserAction,
    editObject?.key,
    fineTuningFlatNumber,
    fineTuningFloor,
    fineTuningStreetNumber,
    isEdit,
    mapComputedAddress?.routeAddressLine,
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
        ? t('screen.common.address.form.title.new')
        : t('screen.common.address.form.title.edit', {
            addressKey: t(
              `screen.common.address.form.title.addressKeys.${editObject?.key}`
            )
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
      setFineTuningStreetNumber(reverseGeocodingResult?.streetNumber)
    } catch (err) {
      addInAppMessage({
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
            title={t(
              'screen.common.address.form.button.updateWithThisLocation'
            )}
            disabled={!hasRegionChanged}
          />
        </View>

        <Input
          label={t('screen.common.address.form.label.addressLine')}
          value={mapComputedAddress?.routeAddressLine}
          containerStyle={styles.addressBoxContainer}
          textContentType="fullStreetAddress"
          editable={false}
          multiline
        />
        <View style={styles.horizontalMarginContainerView}>
          <SegmentedControl
            tintColor={rneTheme.colors?.primary}
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
              'screen.common.address.form.title.section.fineTuning'
            ).toLocaleUpperCase()}
          </Card.Title>
          <Card.Divider />
          <View style={styles.fineTuningInputFormContainer}>
            <Input
              label={t(
                'screen.common.address.form.label.fineTuning.streetNumber'
              )}
              containerStyle={styles.fineTuningInputContainer}
              value={fineTuningStreetNumber}
              onChangeText={(val) => setFineTuningStreetNumber(val)}
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="default"
            />
            <Input
              label={t(
                'screen.common.address.form.label.fineTuning.flatNumber'
              )}
              containerStyle={styles.fineTuningInputContainer}
              value={fineTuningFlatNumber ? `${fineTuningFlatNumber}` : ''}
              onChangeText={(val) => setFineTuningFlatNumber(parseInt(val, 10))}
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="number-pad"
            />
            <Input
              label={t('screen.common.address.form.label.fineTuning.floor')}
              containerStyle={styles.fineTuningInputContainer}
              value={fineTuningFloor ? `${fineTuningFloor}` : ''}
              onChangeText={(val) => setFineTuningFloor(parseInt(val, 10))}
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="number-pad"
            />
            <Input
              label={t('screen.common.address.form.label.addressDirections')}
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
