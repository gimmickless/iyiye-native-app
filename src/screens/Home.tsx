import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

const Home: React.FC = () => {
  const navigation = useNavigation()
  // // Customize header
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerLeft: () => <Button title="Home Header Button" onPress={() => {}} />
  //   })
  // }, [navigation])
  // console.log(navigation)
  return (
    <View style={styles.view}>
      <Button title="To Login" onPress={() => navigation.navigate('SignIn')} />
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  }
})

export default Home
