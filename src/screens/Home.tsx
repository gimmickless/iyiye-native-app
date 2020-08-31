import React, { useLayoutEffect } from 'react'
import { View, StyleSheet, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const Home: React.FC = () => {
  const navigation = useNavigation()
  // Customize header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <Button title="Home Header Button" onPress={() => {}} />
    })
  }, [navigation])
  console.log(navigation)
  return <View style={styles.view} />
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  }
})

export default Home
