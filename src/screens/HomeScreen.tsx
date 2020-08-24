import React from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const HomeScreen: React.FC = () => {
  const navigation = useNavigation()
  console.log(navigation)
  return <View />
}

export default HomeScreen
