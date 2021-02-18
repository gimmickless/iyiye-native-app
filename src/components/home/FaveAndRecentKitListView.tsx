import React from 'react'
import { View } from 'react-native'

interface FaveAndRecentKitListViewProps {
  username: string
}

const FaveAndRecentKitListView: React.FC<FaveAndRecentKitListViewProps> = (
  props
) => {
  const { username } = props
  return <View>{username}</View>
}

export default FaveAndRecentKitListView
