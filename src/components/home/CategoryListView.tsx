import { LocalizationContext } from 'contexts/Localization'
import React, { useContext } from 'react'
import { Image, View, StyleSheet, Pressable, ScrollView } from 'react-native'
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
    <Pressable android_ripple={{ color: 'grey', radius: 64 }}>
      <View
        style={[
          styles.categoryItemContainer,
          { borderColor: rneTheme.colors?.grey1 }
        ]}
      >
        <Image
          style={[
            styles.categoryItemImage,
            { borderColor: rneTheme.colors?.grey1 }
          ]}
          source={{
            uri: props.imageUrl,
            cache: 'only-if-cached'
          }}
        />
        <Text
          style={[styles.categoryItemText, { color: rneTheme.colors?.grey1 }]}
        >
          {props.title}
        </Text>
      </View>
    </Pressable>
  )
}

const CategoryListView: React.FC<CategoryListViewProps> = (props) => {
  const { username } = props
  const { t } = useContext(LocalizationContext)
  const { theme: rneTheme } = useContext(ThemeContext)
  // TODO: Load codes from AppSync
  const categories = [
    {
      title: t('screen.home.default.kitCategory.item.burger'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/burger.jpg'
    },
    {
      title: t('screen.home.default.kitCategory.item.chicken'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/chicken.jpg'
    },
    {
      title: t('screen.home.default.kitCategory.item.glutenFree'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/gluten-free.jpg'
    },
    {
      title: t('screen.home.default.kitCategory.item.halal'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/halal.jpg'
    },
    {
      title: t('screen.home.default.kitCategory.item.jhatka'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/jhatka.jpg'
    },
    {
      title: t('screen.home.default.kitCategory.item.kosher'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/kosher.jpg'
    },
    {
      title: t('screen.home.default.kitCategory.item.nutFree'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/nut-free.jpg'
    },
    {
      title: t('screen.home.default.kitCategory.item.raw'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/raw.jpg'
    },
    {
      title: t('screen.home.default.kitCategory.item.seaFood'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/sea-food.jpg'
    },
    {
      title: t('screen.home.default.kitCategory.item.thai'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/thai.jpg'
    },
    {
      title: t('screen.home.default.kitCategory.item.vegan'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/vegan.jpg'
    },
    {
      title: t('screen.home.default.kitCategory.item.vegetarian'),
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/vegetarian.jpg'
    }
  ]
  return (
    <View>
      <Text
        style={[styles.categoryListTitle, { color: rneTheme.colors?.grey1 }]}
      >
        {t('screen.home.default.kitCategory.title')}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
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
    flexDirection: 'row'
  },
  categoryListTitle: {
    marginBottom: 4
  },
  categoryItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    marginRight: 8,
    borderRadius: 12,
    width: 150,
    padding: 0
  },
  categoryItemImage: {
    height: 48,
    width: 48,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    marginRight: 4,
    overflow: 'hidden'
  },
  categoryItemText: {
    fontWeight: 'bold'
  }
})

export default CategoryListView
