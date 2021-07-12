import React, { useContext } from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import { ThemeContext } from 'react-native-elements'
import { LocalizationContext } from 'contexts/Localization'
import KitListItem from './KitListItem'
import { defaultHomeScrollViewTopMargin } from 'utils/constants'

interface FaveKitListViewProps {
  username: string
}

const FaveKitListView: React.FC<FaveKitListViewProps> = (props) => {
  const { username } = props
  const { t } = useContext(LocalizationContext)
  const { theme: rneTheme } = useContext(ThemeContext)

  const kits = [
    {
      id: '1',
      name: 'Cool Burger',
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/burger.jpg',
      price: 25.0,
      faved: true
    },
    {
      id: '2',
      name: 'Hot Chicken',
      imageUrl:
        'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/chicken.jpg',
      price: 15.0,
      faved: false
    }
  ]

  return (
    <View style={styles.container}>
      <Text style={[styles.listTitle, { color: rneTheme.colors?.grey1 }]}>
        {t('screen.home.default.faveKits.title')}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {kits.map((el) => (
          <KitListItem
            key={el.id}
            id={el.id}
            name={el.name}
            imageUrl={el.imageUrl}
            price={el.price}
            faved={el.faved}
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

export default FaveKitListView
