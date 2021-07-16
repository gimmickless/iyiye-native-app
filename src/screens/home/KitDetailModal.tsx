import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { LocalizationContext } from 'contexts/Localization'
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native'
import { Button, ThemeContext } from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { HomeStackParamList } from 'router/stacks/Home'
import InputSpinner from 'react-native-input-spinner'
import {
  defaultHeaderButtonSize,
  defaultKitImageHeight,
  maxKitCountPerCart
} from 'utils/constants'
import * as Sharing from 'expo-sharing'
import Carousel, { Pagination } from 'react-native-snap-carousel'

type KitDetailModalProps = RouteProp<HomeStackParamList, 'KitDetailModal'>

const KitDetailModal: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<KitDetailModalProps>()
  const { t } = useContext(LocalizationContext)
  const { theme: rneTheme } = useContext(ThemeContext)
  const window = useWindowDimensions()
  const [count, setCount] = useState(0)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [liked, setLiked] = useState(false)
  const id = route.params.id

  const [imageEntries] = useState([
    {
      url: 'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/burger.jpg'
    },
    {
      url: 'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/chicken.jpg'
    }
  ])

  // TODO: Get details from AppSync call
  const isKitInUserCart = false
  const kit = {}

  // Customize header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Kit Name Here',
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          {/* Share */}
          <Pressable
            disabled={true} // TODO: Enable When ready
            onPress={async () => {
              const isShareAvailable = await Sharing.isAvailableAsync()

              if (!isShareAvailable) {
                Alert.alert(
                  t('screen.home.kitDetailModal.alert.shareNotAvailable.title')
                )
                return
              }
              //TODO: Give a real URL
              await Sharing.shareAsync('urlToKit', {})
            }}
          >
            <MaterialCommunityIcons
              name="share-variant"
              size={defaultHeaderButtonSize}
              color={rneTheme.colors?.primary}
            />
          </Pressable>
          {/* Like */}
          <Pressable onPress={() => setLiked((prev) => !prev)}>
            <MaterialCommunityIcons
              name={liked ? 'heart' : 'heart-outline'}
              size={defaultHeaderButtonSize}
              color={rneTheme.colors?.primary}
            />
          </Pressable>
        </View>
      )
    })
  }, [liked, navigation, rneTheme.colors?.primary, t])

  return (
    <SafeAreaView style={styles.container}>
      {/* Scroll View */}
      <ScrollView style={styles.scroll}>
        <Carousel
          layout={'default'}
          data={imageEntries}
          renderItem={({ item }) => (
            <Image source={{ uri: item.url }} style={styles.carouselImage} />
          )}
          onSnapToItem={(i) => setActiveImageIndex(i)}
          sliderWidth={window.width}
          itemWidth={window.width}
        />
        <Pagination
          dotsLength={imageEntries.length}
          activeDotIndex={activeImageIndex}
          dotColor={rneTheme.colors?.black}
          inactiveDotColor={rneTheme.colors?.grey3}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </ScrollView>
      {/* Actions */}
      {/* <View
        style={[styles.action, { backgroundColor: rneTheme.colors?.grey5 }]}
      >
        <Text>€ XX.YY</Text>
        {isKitInUserCart ? (
          <React.Fragment>
            <InputSpinner
              max={maxKitCountPerCart}
              min={1}
              colorMax={'red'}
              value={count}
              onChange={(num: number) => {
                setCount(num)
              }}
            />
            <Button
              type="outline"
              title={t('screen.home.kitDetailModal.button.removeFromCart')}
              icon={
                <MaterialCommunityIcons
                  name="cart-off"
                  size={15}
                  color={rneTheme.colors?.primary}
                />
              }
            />
          </React.Fragment>
        ) : (
          <Button
            type="solid"
            title={t('screen.home.kitDetailModal.button.addToCart')}
            icon={
              <MaterialCommunityIcons
                name="cart"
                size={15}
                color={rneTheme.colors?.white}
              />
            }
          />
        )}
      </View> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerRightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  scroll: {},
  carouselImage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: defaultKitImageHeight
  },
  action: {
    width: 250,
    borderRadius: 12,
    flexDirection: 'row'
  }
})

export default KitDetailModal
