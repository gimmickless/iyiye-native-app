import React from 'react'
import { View, Text } from 'react-native'

interface ActiveOrderListViewProps {
  username: string
}

const ActiveOrderListView: React.FC<ActiveOrderListViewProps> = (props) => {
  const { username } = props
  return (
    <View>
      <Text>{username}</Text>
    </View>
  )
}

export default ActiveOrderListView
