import React, { useState } from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

const Profile: React.FC = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  console.log(navigation)

  return (
    <View style={styles.view}>
      <TextInput
        placeholder={t('screen.signIn.label.usernameOrEmail')}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder={t('screen.signIn.label.password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  }
})

export default Profile
