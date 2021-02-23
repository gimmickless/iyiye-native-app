import React from 'react'
import { View, Text } from 'react-native'

interface FaveAndRecentKitListViewProps {
  username: string
}

const FaveAndRecentKitListView: React.FC<FaveAndRecentKitListViewProps> = (
  props
) => {
  const { username } = props
  return (
    <View>
      <Text>{username}</Text>
    </View>
  )
}

export default FaveAndRecentKitListView
