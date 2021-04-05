import React, { useContext } from 'react'
import { Image, View, StyleSheet, Pressable, FlatList } from 'react-native'
import { Text, ThemeContext } from 'react-native-elements'

interface CategoryItemViewProps {
  title: string
  imageUrl?: string
}

interface CategoryListViewProps {
  username: string
}

const CategoryItem = ({ item }: any) => {
  const { theme: rneTheme } = useContext(ThemeContext)
  return (
    <View
      style={[
        styles.categoryItemContainer,
        { borderColor: rneTheme.colors?.grey0 }
      ]}
    >
      <Pressable android_ripple={{ color: 'grey' }}>
        <Image></Image>
        <Text h3>{item.title}</Text>
      </Pressable>
    </View>
  )
}

const CategoryListView: React.FC<CategoryListViewProps> = (props) => {
  const { username } = props
  const { theme: rneTheme } = useContext(ThemeContext)
  const categories = Array.from(Array(10).keys()).map((el) => ({
    id: el.toString(),
    title: 'Item ' + el
  }))
  return (
    <FlatList
      horizontal
      style={styles.container}
      data={categories}
      renderItem={() => <CategoryItem />}
      keyExtractor={(item) => item.id}
    />
  )
}

const styles = StyleSheet.create({
  categoryItemContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 12,
    width: 128
  },
  container: {
    flexDirection: 'row'
  }
})

export default CategoryListView
