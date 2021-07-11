import React, { useContext, useLayoutEffect, useMemo, useState } from 'react'
import {
  View,
  StyleSheet,
  Pressable,
  Alert,
  useWindowDimensions
} from 'react-native'
import { SearchBar, Text, ThemeContext } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { useAuthUser } from 'contexts/Auth'
import {
  defaultContainerViewHorizontalPadding,
  homeHeaderHeight
} from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { ScrollView } from 'react-native-gesture-handler'
import { MaterialIcons } from '@expo/vector-icons'
import LoadingView from 'components/shared/LoadingView'
import { AddressTypeMaterialCommunityIcon } from 'types/visualization'
import {
  ActiveOrderListView,
  CategoryListView,
  CuratedKitListView,
  FaveAndRecentKitListView,
  NewKitListView
} from 'components/home'
import Carousel from 'react-native-snap-carousel'

const Default: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const { theme: rneTheme } = useContext(ThemeContext)
  const { authUser } = useAuthUser()
  const [searchText, setSearchText] = useState('')
  const window = useWindowDimensions()
  const [carouselEntries] = useState([
    {
      title: '✨ Ads or ...',
      backgroundColor: 'deepskyblue',
      textColor: 'white'
    },
    {
      title: '... some stuff we beg the user to see',
      backgroundColor: 'darkorchid',
      textColor: 'white'
    }
  ])

  const isAuthUser = useMemo(() => authUser.props ?? undefined, [authUser])
  const username = useMemo(
    () => authUser.props?.username ?? '',
    [authUser.props?.username]
  )

  // Customize header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { height: homeHeaderHeight, elevation: 0, shadowOpacity: 0 },
      headerTitle: () => (
        <SearchBar
          value={searchText}
          onChangeText={(val: string) => setSearchText(val)}
          containerStyle={styles.searchBarContainerStyle}
          inputStyle={{
            ...styles.searchBarInputStyle,
            color: rneTheme.colors?.black
          }}
          autoCorrect={false}
          placeholder={t(
            'screen.common.address.locationSearch.titleSearchTextInput.placeholder'
          )}
          returnKeyType="done"
          textContentType="streetAddressLine1"
          cancelButtonTitle={t('common.button.cancel')}
        />
      )
    })
  }, [navigation, rneTheme.colors?.black, searchText, t])

  if (!authUser.loaded) return <LoadingView />
  return (
    <ScrollView style={styles.view}>
      {/* Campaigns and other shit */}
      <Carousel
        autoplay
        enableMomentum
        lockScrollWhileSnapping
        layout={'default'}
        data={carouselEntries}
        sliderWidth={window.width}
        itemWidth={window.width - 16 * defaultContainerViewHorizontalPadding}
        renderItem={({ item }) => (
          <View
            style={{
              ...styles.carouselItem,
              backgroundColor: item.backgroundColor
            }}
          >
            <Text
              style={{
                color: item.textColor
              }}
            >
              {item.title}
            </Text>
          </View>
        )}
      />
      {/* Orders */}
      {isAuthUser && <ActiveOrderListView username={username} />}
      {/* Categories */}
      <CategoryListView username={username} />
      {/* Kits */}
      <CuratedKitListView username={username} />
      {isAuthUser && <FaveAndRecentKitListView username={username} />}
      <NewKitListView />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: defaultContainerViewHorizontalPadding
  },
  searchBarContainerStyle: {
    backgroundColor: 'transparent'
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 75
  },
  searchBarInputStyle: {}
  // headerTitleContainer: {
  //   flex: 1,
  //   height: 64,
  //   paddingVertical: 8,
  //   paddingHorizontal: defaultContainerViewHorizontalPadding,
  //   justifyContent: 'center'
  // },
  // headerTitlePrimaryText: {
  //   alignContent: 'center'
  // },
  // headerTitleSecondaryText: {},
  // headerRightAddressButtonLabelText: {},
  // headerRightAddressButtonText: {},
  // headerRightAddressButton: {
  //   height: 64,
  //   borderWidth: 1,
  //   borderColor: 'lightgrey',
  //   borderRadius: 16,
  //   marginRight: 8,
  //   paddingHorizontal: 8,
  //   marginVertical: 8
  // },
  // headerRightAddressButtonInnerContainer: {
  //   flex: 1,
  //   flexDirection: 'column',
  //   alignItems: 'center',
  //   justifyContent: 'space-around'
  // }
})

export default Default
