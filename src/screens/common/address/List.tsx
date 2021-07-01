import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import {
  Alert,
  Image,
  FlatList,
  StyleSheet,
  View,
  Animated
} from 'react-native'
import { Button, Text, ThemeContext } from 'react-native-elements'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { AuthUserContext } from 'contexts/Auth'
import { LocalizationContext } from 'contexts/Localization'
import LoadingView from 'components/shared/LoadingView'
import { SafeAreaView } from 'react-native-safe-area-context'
import SwipeableListItem from 'components/shared/SwipeableListItem'
import Checkbox from 'react-native-bouncy-checkbox'
import { AuthUserAddress, AuthUserAddressKey } from 'types/context'
import { HomeStackScreenNames } from 'types/route'
import ListSeparator from 'components/shared/ListSeparator'
import {
  headerRightButtonTextFont,
  locationDelta,
  maxAddressCount
} from 'utils/constants'
import { useInAppMessage } from 'contexts/InAppMessage'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { HomeStackParamList } from 'router/stacks/Home'
import { HomeAddressFormRouteProps } from './Form'
import NotFoundView from 'components/shared/NotFoundView'

export type HomeAddressListRouteProps = RouteProp<
  HomeStackParamList,
  'HomeAddressList'
>

type AddressKeyValue = {
  key: string
  value?: AuthUserAddress
}

const addressKeyPrefix = 'address'
const changedListItemBorderInitialOpacity = 2

const getAddressItemIconName = (kind?: string) => {
  if (!kind) return 'map-marker-question'
  switch (kind) {
    case 'home':
      return 'home'
    case 'office':
      return 'office-building'
    default:
      return 'alien'
  }
}

const AddressList: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const { theme: rneTheme } = useContext(ThemeContext)
  const route = useRoute<HomeAddressListRouteProps>()
  const { addInAppMessage } = useInAppMessage()
  const [operationInProgress, setOperationInProgress] = useState(false)
  const { state: authUser, action: authUserAction } =
    useContext(AuthUserContext)
  const [defaultAddressKey, setDefaultAddressKey] =
    useState<AuthUserAddressKey>()
  const [addresses, setAddresses] = useState<Array<AddressKeyValue>>([])

  const changedAddressKey = route.params?.changedAddressKey

  const changedListItemBorderOpacity = new Animated.Value(
    changedListItemBorderInitialOpacity
  )
  const [
    changedListItemActualBorderOpacity,
    setChangedListItemActualBorderOpacity
  ] = useState(changedListItemBorderInitialOpacity)

  useEffect(() => {
    const addressList = [
      { key: `${addressKeyPrefix}1`, value: authUser.props?.address1 },
      { key: `${addressKeyPrefix}2`, value: authUser.props?.address2 },
      { key: `${addressKeyPrefix}3`, value: authUser.props?.address3 },
      { key: `${addressKeyPrefix}4`, value: authUser.props?.address4 },
      { key: `${addressKeyPrefix}5`, value: authUser.props?.address5 }
    ]
    setAddresses(addressList.filter((x) => x.value))

    setDefaultAddressKey(authUser.props?.address)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const opacityListenerId = changedListItemBorderOpacity.addListener(
      (progress) => {
        if (Math.round(progress.value) === changedListItemActualBorderOpacity) {
          return
        }
        setChangedListItemActualBorderOpacity(progress.value)
      }
    )
    Animated.timing(changedListItemBorderOpacity, {
      useNativeDriver: true,
      toValue: 0,
      duration: 1500
    }).start()
    return () => changedListItemBorderOpacity.removeListener(opacityListenerId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          type="clear"
          icon={
            <MaterialCommunityIcons
              name="plus"
              size={15}
              color={rneTheme.colors?.primary}
            />
          }
          title={t('screen.common.address.list.button.create')}
          onPress={() => {
            if (addresses.length >= maxAddressCount) {
              Alert.alert(
                t('screen.common.address.list.alert.maxAddressLimit.title'),
                t('screen.common.address.list.alert.maxAddressLimit.message'),
                [
                  {
                    text: t('common.button.ok'),
                    onPress: () => {
                      return
                    },
                    style: 'cancel'
                  }
                ],
                { cancelable: true }
              )
              return
            }
            navigation.navigate(HomeStackScreenNames.AddressLocationSearch)
          }}
        />
      )
    })
  }, [addresses.length, navigation, rneTheme.colors?.primary, t])

  const onClickItemCheckbox = async (itemKey: AuthUserAddressKey) => {
    await authUserAction.update({
      ...authUser.props,
      fullName: authUser.props?.fullName ?? '',
      address: itemKey
    })
    setDefaultAddressKey(itemKey)
  }

  const editAction = (input: {
    itemKey: AuthUserAddressKey
    latLng: {
      latitude: number | undefined
      longitude: number | undefined
    }
  }) => {
    navigation.navigate(HomeStackScreenNames.AddressForm, {
      edit: {
        key: input.itemKey
      },
      initialRegion: {
        latitude: input.latLng.latitude,
        longitude: input.latLng.longitude,
        latitudeDelta: locationDelta,
        longitudeDelta: locationDelta
      }
    } as HomeAddressFormRouteProps['params'])
  }

  const deleteAction = async (itemKey: AuthUserAddressKey) => {
    setOperationInProgress(true)
    try {
      const deletedItemAddresses = addresses.filter((x) => x.key !== itemKey)
      deletedItemAddresses.forEach((el, i) => {
        el.key = `${addressKeyPrefix}${i + 1}`
      })
      const deletedItemAddressesObj = deletedItemAddresses.reduce(
        (obj, item) => Object.assign(obj, { [item.key]: item.value }),
        {}
      )

      await authUserAction.updateAddresses(deletedItemAddressesObj)
      setAddresses(deletedItemAddresses)
    } catch (err) {
      addInAppMessage({
        message: err.message ?? err,
        type: 'error'
      })
    } finally {
      setOperationInProgress(false)
    }
  }

  return !authUser.loaded || operationInProgress ? (
    <LoadingView />
  ) : !addresses || !addresses.length ? (
    <View style={styles.nothingFoundContainer}>
      <NotFoundView
        message={t('screen.common.address.list.message.nothingFound')}
      />
      <Button
        style={styles.nothingFoundAddNewButton}
        title={t('screen.common.address.list.button.createFirstAddress')}
        onPress={() =>
          navigation.navigate(HomeStackScreenNames.AddressLocationSearch)
        }
        icon={
          <MaterialCommunityIcons
            name="star-four-points"
            size={15}
            color="white"
          />
        }
      />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.listContainer}
        data={addresses}
        renderItem={({ item, index }) => {
          const borderColor =
            changedAddressKey === item.key
              ? `rgba(0, 255, 255, ${changedListItemActualBorderOpacity})`
              : 'transparent'
          return (
            <Animated.View
              style={[
                styles.listOuterView,
                {
                  borderColor: borderColor
                }
              ]}
            >
              <SwipeableListItem
                hintOnShowUp={index === 0}
                editAction={() =>
                  editAction({
                    itemKey: item.key as AuthUserAddressKey,
                    latLng: {
                      latitude: item.value?.latitude,
                      longitude: item.value?.longitude
                    }
                  })
                }
                deleteAction={() =>
                  deleteAction(item.key as AuthUserAddressKey)
                }
              >
                <View style={styles.listItem}>
                  <View style={styles.listItemCheckboxField}>
                    <Checkbox
                      size={25}
                      fillColor={rneTheme.colors?.primary}
                      unfillColor="transparent"
                      iconStyle={{
                        borderColor: rneTheme.colors?.primary
                      }}
                      disableText
                      isChecked={item.key === defaultAddressKey}
                      onPress={() =>
                        onClickItemCheckbox(item.key as AuthUserAddressKey)
                      }
                    />
                  </View>
                  <View style={styles.listItemTypeIconField}>
                    <MaterialCommunityIcons
                      name={getAddressItemIconName(item.value?.kind)}
                      size={25}
                      color={rneTheme.colors?.grey2}
                    />
                  </View>
                  <View style={styles.listItemMainField}>
                    <Text>{item.value?.routeAddress}</Text>
                    <View style={styles.listItemMainFieldSubtitleContainer}>
                      <View style={styles.listItemMainFieldSubtitleItem}>
                        <Text
                          style={[
                            styles.listItemMainFieldSubtitleKey,
                            { color: rneTheme.colors?.grey2 }
                          ]}
                        >
                          {t(
                            'screen.common.address.list.list.subtitle.streetNumber'
                          )}
                          :&nbsp;
                        </Text>
                        <Text
                          style={[
                            styles.listItemMainFieldSubtitle,
                            { color: rneTheme.colors?.grey2 }
                          ]}
                        >
                          {item.value?.flatNumber
                            ? `${item.value?.streetNumber} / ${item.value?.flatNumber}`
                            : item.value?.streetNumber}
                        </Text>
                      </View>
                      {item.value?.floor && (
                        <View style={styles.listItemMainFieldSubtitleItem}>
                          <Text
                            style={[
                              styles.listItemMainFieldSubtitleKey,
                              { color: rneTheme.colors?.grey2 }
                            ]}
                          >
                            {t(
                              'screen.common.address.list.list.subtitle.floor'
                            )}
                            :&nbsp;
                          </Text>
                          <Text
                            style={[
                              styles.listItemMainFieldSubtitle,
                              { color: rneTheme.colors?.grey2 }
                            ]}
                          >
                            {item.value?.floor}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </SwipeableListItem>
            </Animated.View>
          )
        }}
        keyExtractor={(item) => item.key}
        ItemSeparatorComponent={ListSeparator}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  nothingFoundContainer: {
    flex: 1,
    marginVertical: 192,
    marginHorizontal: 36,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  listOuterView: {
    borderWidth: 1.5,
    borderRadius: 12
  },
  headerRightButton: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerRightButtonText: {
    fontSize: headerRightButtonTextFont
  },
  listContainer: { paddingHorizontal: 8 },
  listItem: {
    flex: 1,
    flexDirection: 'row'
  },
  listItemCheckboxField: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItemTypeIconField: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItemMainField: {
    flex: 6
  },
  listItemMainFieldSubtitleContainer: {
    flexDirection: 'row'
  },
  listItemMainFieldSubtitleItem: {
    flex: 1
  },
  listItemMainFieldSubtitle: {
    fontStyle: 'italic'
  },
  listItemMainFieldSubtitleKey: {},
  nothingFoundText: {
    marginBottom: 10
  },
  nothingFoundAddNewButton: {
    flex: 1
  }
})

export default AddressList
