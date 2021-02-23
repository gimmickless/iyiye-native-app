import React from 'react'
import { View, Text } from 'react-native'

interface CategoryListViewProps {
  username: string
}

const CategoryListView: React.FC<CategoryListViewProps> = (props) => {
  const { username } = props
  return (
    <View>
      <Text>{username}</Text>
    </View>
  )
}

export default CategoryListView
