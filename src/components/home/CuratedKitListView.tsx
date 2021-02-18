import React from 'react'
import { View } from 'react-native'

interface CuratedKitListViewProps {
  username: string
}

const CuratedKitListView: React.FC<CuratedKitListViewProps> = (props) => {
  const { username } = props
  return <View>{username}</View>
}

export default CuratedKitListView
