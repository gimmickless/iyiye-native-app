import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { Text } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

const List: React.FC = () => {
  const navigation = useNavigation()
  console.log(navigation)
  return (
    <SafeAreaView style={styles.view}>
      <Text h1>Recipe Kit Items</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  }
})

export default List
