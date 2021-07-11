import React, { useContext } from 'react'
import { Image, StyleSheet, View, Text, Pressable } from 'react-native'
import { ThemeContext } from 'react-native-elements'

const borderRadius = 12
const imageHeight = 48
const imageWidth = 48

interface CategoryItemViewProps {
  title: string
  imageUrl?: string
}

const CategoryItem: React.FC<CategoryItemViewProps> = (props) => {
  const { theme: rneTheme } = useContext(ThemeContext)
  return (
    <Pressable android_ripple={{ color: 'grey', radius: 64 }}>
      <View style={[styles.container, { borderColor: rneTheme.colors?.grey1 }]}>
        <Image
          style={[styles.image, { borderColor: rneTheme.colors?.grey1 }]}
          source={{
            uri: props.imageUrl,
            cache: 'only-if-cached'
          }}
        />
        <Text style={[styles.title, { color: rneTheme.colors?.grey1 }]}>
          {props.title}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    marginRight: 8,
    borderRadius: borderRadius,
    width: 150,
    padding: 0
  },
  image: {
    height: imageHeight,
    width: imageWidth,
    borderTopLeftRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
    marginRight: 4,
    overflow: 'hidden'
  },
  title: {
    fontWeight: 'bold'
  }
})

export default CategoryItem
