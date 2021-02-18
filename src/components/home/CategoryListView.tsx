import React from 'react'
import { View } from 'react-native'

interface CategoryListViewProps {
  username: string
}

const CategoryListView: React.FC<CategoryListViewProps> = (props) => {
  const { username } = props
  return <View>{username}</View>
}

export default CategoryListView
