import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const Settings: React.FC = () => {
  const navigation = useNavigation()
  console.log(navigation)
  return <View />
}

const styles = StyleSheet.create({})

export default Settings
