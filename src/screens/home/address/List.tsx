import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
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
import Checkbox from 'expo-checkbox'
import { AuthUserAddress, AuthUserAddressKey } from 'types/context'
import { AddressTypeEmoji } from 'types/visualization'
import { HomeStackScreenNames } from 'types/route'
import ListSeparator from 'components/shared/ListSeparator'
import { headerRightButtonTextFont, maxAddressCount } from 'utils/constants'
import { useInAppNotification } from 'contexts/InAppNotification'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { HomeStackParamList } from 'router/stacks/Home'

export type HomeAddressListRouteProps = RouteProp<
  HomeStackParamList,
  'HomeAddressList'
>

type AddressKeyValue = {
  key: string
  value?: AuthUserAddress
}

const addressKeyPrefix = 'address'

const AddressList: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const { theme: rneTheme } = useContext(ThemeContext)
  const route = useRoute<HomeAddressListRouteProps>()
  const { addNotification } = useInAppNotification()
  const [operationInProgress, setOperationInProgress] = useState(false)
  const { state: authUser, action: authUserAction } = useContext(
    AuthUserContext
  )
  const [
    defaultAddressKey,
    setDefaultAddressKey
  ] = useState<AuthUserAddressKey>()
  const [addresses, setAddresses] = useState<Array<AddressKeyValue>>([])

  const changedAddressKey = route.params?.changedAddressKey

  const changedListItemBorderOpacity = useRef(new Animated.Value(1)).current

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
  }, [
    authUser.props?.address,
    authUser.props?.address1,
    authUser.props?.address2,
    authUser.props?.address3,
    authUser.props?.address4,
    authUser.props?.address5
  ])

  useEffect(() => {
    Animated.timing(changedListItemBorderOpacity, {
      useNativeDriver: true,
      toValue: 0,
      duration: 2000
    }).start()
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
          title={t('screen.home.addressList.button.create')}
          onPress={() => {
            if (addresses.length >= maxAddressCount) {
              Alert.alert(
                t('screen.home.addressList.alert.maxAddressLimit.title'),
                t('screen.home.addressList.alert.maxAddressLimit.message'),
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

  const getAddressItemIcon = (address: AuthUserAddress | undefined) => {
    if (!address) return
    switch (address.kind) {
      case 'current':
        return AddressTypeEmoji.Current
      case 'home':
        return AddressTypeEmoji.Home
      case 'office':
        return AddressTypeEmoji.Office
      default:
        return AddressTypeEmoji.Other
    }
  }

  const renderListItem = (item: AddressKeyValue) => {
    return (
      <View style={styles.listItem}>
        <View style={styles.listItemCheckboxField}>
          <Checkbox
            value={item.key === defaultAddressKey}
            onValueChange={() =>
              onClickItemCheckbox(item.key as AuthUserAddressKey)
            }
          />
        </View>
        <View style={styles.listItemIconField}>
          {getAddressItemIcon(item.value)}
        </View>
        <View style={styles.listItemMainField}>
          <Text h4>{item.value?.kind}</Text>
          <Text>
            {item.value?.streetAddress}
            Asddsajjjjjjjjjjjjjjjjjjjjjjjjjjjjjdasdasdsadasdd
          </Text>
        </View>
      </View>
    )
  }

  const editAction = (itemKey: AuthUserAddressKey) => {
    navigation.navigate(HomeStackScreenNames.AddressForm, {
      edit: {
        key: itemKey
      }
    })
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
      addNotification({
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
      <Image source={require('visuals/notfound.png')} />
      <Text
        h4
        style={{ ...styles.nothingFoundText, color: rneTheme.colors?.grey1 }}
      >
        {t('screen.home.addressList.message.nothingFound')}
      </Text>
      <Button
        style={styles.nothingFoundAddNewButton}
        title={t('screen.home.addressList.button.createFirstAddress')}
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
        renderItem={({ item }) => {
          const borderColor =
            changedAddressKey === item.key
              ? `rgba(0, 255, 255, ${changedListItemBorderOpacity})`
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
                editAction={() => editAction(item.key as AuthUserAddressKey)}
                deleteAction={() =>
                  deleteAction(item.key as AuthUserAddressKey)
                }
              >
                {() => renderListItem(item)}
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
    borderWidth: 1
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
    flex: 1,
    alignItems: 'center'
  },
  listItemIconField: {
    flex: 1,
    alignItems: 'center'
  },
  listItemMainField: {
    flex: 6
    // alignItems: 'center'
  },
  nothingFoundText: {
    marginBottom: 10
  },
  nothingFoundAddNewButton: {
    flex: 1
  }
})

export default AddressList
