import React, { useContext } from 'react'
import {
  Image,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList
} from 'react-native'
import { Text, ThemeContext } from 'react-native-elements'

interface CategoryItemViewProps {
  title: string
  imageUrl?: string
}

interface CategoryListViewProps {
  username: string
}

const CategoryItem: React.FC<CategoryItemViewProps> = (props) => {
  const { theme: rneTheme } = useContext(ThemeContext)
  return (
    <View
      style={[
        styles.categoryItemContainer,
        { borderColor: rneTheme.colors?.grey0 }
      ]}
    >
      <Pressable android_ripple={{ color: 'grey' }}>
        <Image
          style={styles.categoryItemImage}
          source={{
            uri: props.imageUrl
          }}
        />
        <Text h4>{props.title}</Text>
      </Pressable>
    </View>
  )
}

const CategoryListView: React.FC<CategoryListViewProps> = (props) => {
  const { username } = props
  const { theme: rneTheme } = useContext(ThemeContext)
  const categories = [
    {
      title: 'Burger',
      imageUrl: 'https://unsplash.com/photos/sc5sTPMrVfk'
    },
    {
      title: 'Salad',
      imageUrl: 'https://unsplash.com/photos/bBzjWthTqb8'
    },
    {
      title: 'Fish',
      imageUrl: 'https://unsplash.com/photos/Sz0sTpO8U6g'
    },
    {
      title: 'Thai',
      imageUrl: 'https://unsplash.com/photos/ElvU9T6-b0M'
    }
  ]
  return (
    <ScrollView horizontal style={styles.container}>
      {categories.map((el) => (
        <CategoryItem title={el.title} imageUrl={el.imageUrl} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  categoryItemContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 12,
    width: 128
  },
  categoryItemImage: {
    width: 48
  }
})

export default CategoryListView
