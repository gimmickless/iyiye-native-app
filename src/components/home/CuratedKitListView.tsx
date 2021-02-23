import React from 'react'
import { View, Text } from 'react-native'

interface CuratedKitListViewProps {
  username: string
}

const CuratedKitListView: React.FC<CuratedKitListViewProps> = (props) => {
  const { username } = props
  return (
    <View>
      <Text>{username}</Text>
    </View>
  )
}

export default CuratedKitListView
