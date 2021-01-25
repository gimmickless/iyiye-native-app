import React, { useContext } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { AuthUserContext } from 'contexts/Auth'
import { textColor } from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { ScrollView } from 'react-native-gesture-handler'

const Addresses: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const { state: authUser } = useContext(AuthUserContext)

  return !authUser.loaded ? (
    <View style={styles.loadingView}>
      <ActivityIndicator />
    </View>
  ) : (
    <ScrollView style={styles.view}>
      <Button title="To Login" onPress={() => navigation.navigate('SignIn')} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  loadingView: {
    flex: 1,
    justifyContent: 'center'
  },
  headerTitleContainer: {
    flex: 1,
    height: 64,
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'center'
  },
  headerTitlePrimaryText: {
    color: textColor.header.title,
    alignContent: 'center'
  },
  headerTitleSecondaryText: {
    color: textColor.header.subtitle
  },
  headerRightAddressButtonText: {
    color: textColor.header.title
  },
  headerRightAddressButton: {
    height: 64,
    backgroundColor: 'ghostwhite',
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 20,
    marginRight: 8,
    paddingHorizontal: 8,
    marginVertical: 8
  },
  headerRightAddressButtonInnerContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
})

export default Addresses
