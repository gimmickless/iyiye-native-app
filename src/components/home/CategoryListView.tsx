import { LocalizationContext } from 'contexts/Localization'
import React, { useContext } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text, ThemeContext } from 'react-native-elements'
import { defaultHomeScrollViewTopMargin } from 'utils/constants'
import CategoryItem from './CategoryListItem'

interface CategoryListViewProps {
  username: string
}

const CategoryListView: React.FC<CategoryListViewProps> = (props) => {
  const { username } = props
  const { t } = useContext(LocalizationContext)
  const { theme: rneTheme } = useContext(ThemeContext)
  // TODO: Load codes from AppSync
  const categories = [
    {
      title: t('screen.home.default.kitCategories.item.burger'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/burger.jpg'
    },
    {
      title: t('screen.home.default.kitCategories.item.chicken'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/chicken.jpg'
    },
    {
      title: t('screen.home.default.kitCategories.item.glutenFree'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/gluten-free.jpg'
    },
    {
      title: t('screen.home.default.kitCategories.item.halal'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/halal.jpg'
    },
    {
      title: t('screen.home.default.kitCategories.item.jhatka'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/jhatka.jpg'
    },
    {
      title: t('screen.home.default.kitCategories.item.kosher'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/kosher.jpg'
    },
    {
      title: t('screen.home.default.kitCategories.item.nutFree'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/nut-free.jpg'
    },
    {
      title: t('screen.home.default.kitCategories.item.raw'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/raw.jpg'
    },
    {
      title: t('screen.home.default.kitCategories.item.seaFood'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/sea-food.jpg'
    },
    {
      title: t('screen.home.default.kitCategories.item.thai'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/thai.jpg'
    },
    {
      title: t('screen.home.default.kitCategories.item.vegan'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/vegan.jpg'
    },
    {
      title: t('screen.home.default.kitCategories.item.vegetarian'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/vegetarian.jpg'
    }
  ]
  return (
    <View style={styles.container}>
      <Text style={[styles.listTitle, { color: rneTheme.colors?.grey2 }]}>
        {t('screen.home.default.kitCategories.title')}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {categories.map((el) => (
          <CategoryItem
            key={el.title}
            title={el.title}
            imageUrl={el.imageUrl}
          />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: defaultHomeScrollViewTopMargin
  },
  scrollContainer: {
    flexDirection: 'row'
  },
  listTitle: {
    marginBottom: 4
  }
})

export default CategoryListView
