import React from 'react'
import { View } from 'react-native'

interface ActiveOrderListViewProps {
  username: string
}

const ActiveOrderListView: React.FC<ActiveOrderListViewProps> = (props) => {
  const { username } = props
  return <View>{username}</View>
}

export default ActiveOrderListView
