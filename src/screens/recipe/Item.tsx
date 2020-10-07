import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

const Item: React.FC = () => {
  const navigation = useNavigation()
  console.log(navigation)
  return (
    <View style={styles.view}>
      <Text h1>Recipe Items</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  }
})

export default Item
