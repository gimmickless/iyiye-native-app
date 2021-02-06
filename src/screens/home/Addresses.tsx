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
  Home = 'home',
  Office = 'office',
  Other1 = 'other1',
  Other2 = 'other2'
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
      { type: AddressTypes.Default, value: authUser.props?.address },
      { type: AddressTypes.Home, value: authUser.props?.homeAddress },
      { type: AddressTypes.Office, value: authUser.props?.officeAddress },
      { type: AddressTypes.Other1, value: authUser.props?.otherAddress1 },
      { type: AddressTypes.Other2, value: authUser.props?.otherAddress2 }
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
        renderItem={(item) => <Item type={item.type} value={item.value} />}
        keyExtractor={(address) => address.type}
      /> */}
      <Button
        title={t('screen.home.addresses.button.create')}
        onPress={() => setUpsertAddressModal(false)}
      />
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
