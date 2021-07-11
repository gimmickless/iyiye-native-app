import { useNavigation } from '@react-navigation/native'
import { LocalizationContext } from 'contexts/Localization'
import React, { useContext } from 'react'
import { SafeAreaView, Text, StyleSheet } from 'react-native'
import { Button, ThemeContext } from 'react-native-elements'
import { AuthStackParamList } from 'router/stacks/Auth'
import LottieView from 'lottie-react-native'

const GuestNotAllowedView: React.FC = () => {
  const navigation = useNavigation()
  const { theme: rneTheme } = useContext(ThemeContext)
  const { t } = useContext(LocalizationContext)
  return (
    <SafeAreaView style={styles.container}>
      <LottieView
        source={require('visuals/lottie/lock.json')}
        autoPlay
        style={styles.lottieView}
      />
      <Text style={[styles.message, { color: rneTheme.colors?.grey1 }]}>
        {t('component.auth.guestNotAllowed.message')}
      </Text>
      <Button
        style={styles.button}
        title={t('component.auth.guestNotAllowed.button.goToLogin')}
        onPress={() =>
          navigation.navigate('SignIn' as keyof AuthStackParamList)
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  lottieView: {
    marginTop: 50,
    width: 300,
    height: 300
  },
  message: {
    marginTop: 50,
    marginBottom: 50
  },
  button: {}
})

export default GuestNotAllowedView
