import React, { useContext, useLayoutEffect, useMemo, useState } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { AuthUserContext } from 'contexts/Auth'
import { textColor } from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import LoadingView from 'components/shared/LoadingView'
import { FlatList } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'

enum AddressTypes {
  Default = 'default',
  AltAddress1 = 'altAddress1',
  AltAddress2 = 'altAddress2',
  AltAddress3 = 'altAddress3',
  AltAddress4 = 'altAddress4',
  AltAddress5 = 'altAddress5'
}

// const Item = (type?: string, value?: string) => (
//   <View style={styles.item}>
//     <Text style={styles.title}>{type}</Text>
//     <Text style={styles.title}>{value}</Text>
//   </View>
// )

const Addresses: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const { state: authUser } = useContext(AuthUserContext)
  const [upsertAddressModal, setUpsertAddressModal] = useState(false)
  const addresses = useMemo(
    () => [
      { key: AddressTypes.Default, value: authUser.props?.address },
      { key: AddressTypes.AltAddress1, value: authUser.props?.altAddress1 },
      { key: AddressTypes.AltAddress2, value: authUser.props?.altAddress2 },
      { key: AddressTypes.AltAddress3, value: authUser.props?.altAddress3 },
      { key: AddressTypes.AltAddress4, value: authUser.props?.altAddress4 },
      { key: AddressTypes.AltAddress5, value: authUser.props?.altAddress5 }
    ],
    [authUser]
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => setUpsertAddressModal(false)}
          title={t('screen.home.addresses.button.create')}
        />
      )
    })
  }, [navigation, t])

  return !authUser.loaded ? (
    <LoadingView />
  ) : (
    <SafeAreaView style={styles.container}>
      {/* <FlatList
        data={addresses}
        renderItem={(item) => <Item type={item.key} value={item.value} />}
        keyExtractor={(address) => address.key}
      /> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8
  }
})

export default Addresses
