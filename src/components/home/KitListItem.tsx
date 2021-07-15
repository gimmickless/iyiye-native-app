import { useNavigation } from '@react-navigation/native'
import React, { useContext } from 'react'
import { Image, StyleSheet, View, Text, Pressable } from 'react-native'
import { ThemeContext } from 'react-native-elements'
import { HomeStackParamList } from 'router/stacks/Home'

const borderRadius = 12
const imageHeight = 100
const imageWidth = 125

interface KitListItemProps {
  id: string
  name: string
  imageUrl?: string
  price: number
  faved?: boolean
}

const KitListItem: React.FC<KitListItemProps> = (props) => {
  const { id, name, imageUrl, price, faved } = props
  const navigation = useNavigation()
  const { theme: rneTheme } = useContext(ThemeContext)
  return (
    <Pressable
      android_ripple={{ color: 'grey', radius: 64 }}
      onPress={() =>
        navigation.navigate('KitDetailModal' as keyof HomeStackParamList, {
          id
        })
      }
    >
      <View style={[styles.container, { borderColor: rneTheme.colors?.grey2 }]}>
        <Image
          style={[styles.image, { borderColor: rneTheme.colors?.grey1 }]}
          source={{
            uri: imageUrl,
            cache: 'only-if-cached'
          }}
        />
        <Text style={[styles.name, { color: rneTheme.colors?.grey0 }]}>
          {name}
        </Text>
        <Text style={[styles.price, { color: rneTheme.colors?.grey2 }]}>
          {price}
        </Text>
      </View>
    </Pressable>
  )
}
const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius,
    flexDirection: 'column',
    marginRight: 8
  },
  image: {
    height: imageHeight,
    width: imageWidth,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    marginRight: 4,
    overflow: 'hidden'
  },
  name: {
    fontWeight: 'bold'
  },
  price: {}
})

export default KitListItem
