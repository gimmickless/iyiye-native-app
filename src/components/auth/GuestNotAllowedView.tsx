import { useNavigation } from '@react-navigation/native'
import { LocalizationContext } from 'contexts/Localization'
import React, { useContext } from 'react'
import { SafeAreaView, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import { AuthStackScreenNames } from 'types/route'

const GuestNotAllowedView: React.FC = () => {
  const navigation = useNavigation()
  const { t } = useContext(LocalizationContext)
  return (
    <SafeAreaView style={styles.container}>
      <Text>{t('component.auth.guestNotAllowed.message')}</Text>
      <Button
        style={styles.button}
        title={t('component.auth.guestNotAllowed.button.goToLogin')}
        onPress={() => navigation.navigate(AuthStackScreenNames.SignIn)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {}
})

export default GuestNotAllowedView
