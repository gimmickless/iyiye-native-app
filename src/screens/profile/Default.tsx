import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const Profile: React.FC = () => {
  const navigation = useNavigation()
  console.log(navigation)
  return <View style={styles.view} />
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  }
})

export default Profile
