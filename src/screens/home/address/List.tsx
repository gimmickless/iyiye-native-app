import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { AuthUserContext } from 'contexts/Auth'
import { LocalizationContext } from 'contexts/Localization'
import LoadingView from 'components/shared/LoadingView'
import { FlatList } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import SwipeableListItem from 'components/shared/SwipeableListItem'
import Checkbox from 'expo-checkbox'
import { AuthUserAddress, AuthUserAddressKey } from 'types/context'
import { AddressTypeEmoji } from 'types/visualization'
import { HomeStackScreenNames } from 'types/route'
import ListSeparator from 'components/shared/ListSeparator'
import { useToast } from 'react-native-styled-toast'
import { maxAddressCount } from 'utils/constants'

type AddressKeyValue = {
  key: string
  value?: AuthUserAddress
}

const addressPrefix = 'address'

const AddressList: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const { toast } = useToast()
  const [operationInProgress, setOperationInProgress] = useState(false)
  const { state: authUser, action: authUserAction } = useContext(
    AuthUserContext
  )
  const [
    defaultAddressKey,
    setDefaultAddressKey
  ] = useState<AuthUserAddressKey>()
  const [addresses, setAddresses] = useState<Array<AddressKeyValue>>([])

  useEffect(() => {
    const addressList = [
      { key: `${addressPrefix}1`, value: authUser.props?.address1 },
      { key: `${addressPrefix}2`, value: authUser.props?.address2 },
      { key: `${addressPrefix}3`, value: authUser.props?.address3 },
      { key: `${addressPrefix}4`, value: authUser.props?.address4 },
      { key: `${addressPrefix}5`, value: authUser.props?.address5 }
    ].filter((x) => x.value)
    setAddresses(addressList)

    setDefaultAddressKey(authUser.props?.address)
  }, [
    authUser.props?.address,
    authUser.props?.address1,
    authUser.props?.address2,
    authUser.props?.address3,
    authUser.props?.address4,
    authUser.props?.address5
  ])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          <Item
            onPress={() => {
              if (addresses.length >= maxAddressCount) {
                Alert.alert(
                  t('screen.home.addressList.alert.maxAddressLimit.title'),
                  t('screen.home.addressList.alert.maxAddressLimit.message'),
                  [
                    {
                      text: t('common.button.ok'),
                      onPress: () => {},
                      style: 'cancel'
                    }
                  ],
                  { cancelable: true }
                )
                return
              }
              navigation.navigate(HomeStackScreenNames.AddressLocationSearch)
            }}
            title={t('screen.home.addressList.button.create')}
          />
        </HeaderButtons>
      )
    })
  }, [addresses.length, navigation, t])

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
          <Text h4>{item.value?.name}</Text>
          <Text>
            {item.value?.line1}
            Asddsajjjjjjjjjjjjjjjjjjjjjjjjjjjjjdasdasdsadasdd
          </Text>
        </View>
      </View>
    )
  }

  const editAction = (itemKey: AuthUserAddressKey) => {
    navigation.navigate(HomeStackScreenNames.AddressForm, {
      editAddressKey: itemKey
    })
  }

  const deleteAction = async (itemKey: AuthUserAddressKey) => {
    setOperationInProgress(true)
    try {
      const deletedItemAddresses = addresses.filter((x) => x.key !== itemKey)
      deletedItemAddresses.forEach((el, i) => {
        el.key = `${addressPrefix}${i + 1}`
      })
      const deletedItemAddressesObj = deletedItemAddresses.reduce(
        (obj, item) => Object.assign(obj, { [item.key]: item.value }),
        {}
      )

      await authUserAction.updateAddresses(deletedItemAddressesObj)
      setAddresses(deletedItemAddresses)
      setOperationInProgress(false)
    } catch (err) {
      toast({
        message: err,
        intent: 'ERROR',
        duration: 0
      })
      setOperationInProgress(false)
    }
  }

  return !authUser.loaded || operationInProgress ? (
    <LoadingView />
  ) : !addresses ? (
    <View style={styles.nothingFoundContainer}>
      <Image source={require('assets/notfound.png')} />
      <Text h4 style={styles.nothingFound}>
        {t('screen.home.addressList.message.nothingFound')}
      </Text>
      <Pressable
        onPress={() =>
          navigation.navigate(HomeStackScreenNames.AddressLocationSearch)
        }
      >
        {t('screen.home.addressList.button.create')}
      </Pressable>
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.listContainer}
        data={addresses}
        renderItem={({ item }) => (
          <SwipeableListItem
            editAction={() => editAction(item.key as AuthUserAddressKey)}
            deleteAction={() => deleteAction(item.key as AuthUserAddressKey)}
          >
            {() => renderListItem(item)}
          </SwipeableListItem>
        )}
        keyExtractor={(item) => item.key}
        ItemSeparatorComponent={ListSeparator}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  nothingFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center'
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
  nothingFound: {
    color: 'dimgrey'
  }
})

export default AddressList
