import React, { useContext, useLayoutEffect, useMemo, useState } from 'react'
import {
  View,
  StyleSheet,
  Pressable,
  Alert,
  useWindowDimensions,
  Dimensions
} from 'react-native'
import { Button, SearchBar, Text, ThemeContext } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { useAuthUser } from 'contexts/Auth'
import {
  defaultContainerViewHorizontalPadding,
  homeHeaderHeight,
  homeHeaderSearchBarWidthSubtrahend
} from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { ScrollView } from 'react-native-gesture-handler'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import LoadingView from 'components/shared/LoadingView'
import {
  ActiveOrderListView,
  CategoryListView,
  CuratedKitListView,
  FaveKitListView,
  NewKitListView
} from 'components/home'
import Carousel from 'react-native-snap-carousel'
import { RootStackParamList } from 'router'
import { useColorScheme } from 'react-native-appearance'

const headerElementColor = 'tomato'

const Default: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const scheme = useColorScheme()
  const { theme: rneTheme } = useContext(ThemeContext)
  const { authUser } = useAuthUser()
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

  const isDarkMode = scheme === 'dark'
  const isAuthUser = useMemo(() => authUser.props ?? undefined, [authUser])
  const username = useMemo(
    () => authUser.props?.username ?? '',
    [authUser.props?.username]
  )

  // Customize header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        height: homeHeaderHeight
      },
      headerTranslucent: true,
      headerLeft: () => <Text style={styles.logoText}>##</Text>,
      headerTitle: () => (
        <Pressable
          onPress={() =>
            navigation.navigate('HomeSearch' as keyof RootStackParamList)
          }
        >
          <SearchBar
            pointerEvents="none"
            onChangeText={(val: string) => {
              return
            }}
            value=""
            editable={false}
            containerStyle={styles.searchBarContainerStyle}
            platform="default"
            lightTheme={!isDarkMode}
            inputStyle={{
              ...styles.searchBarInputStyle
              // color: rneTheme.colors?.black
            }}
            autoCorrect={false}
            placeholder={t('screen.home.default.placeholder.search')}
          />
        </Pressable>
      ),
      headerRight: () => (
        <Button
          type="clear"
          buttonStyle={styles.addItemButton}
          icon={
            <MaterialCommunityIcons
              name="layers-plus"
              size={32}
              color={headerElementColor}
            />
          }
          onPress={() => {
            isAuthUser
              ? Alert.alert('TODO: Navigate to Add new kit page')
              : navigation.navigate('SignIn' as keyof AuthStackParamList)
          }}
        />
      )
    })
  }, [
    isAuthUser,
    navigation,
    rneTheme.colors?.black,
    rneTheme.colors?.primary,
    t
  ])

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
      {isAuthUser && <FaveKitListView username={username} />}
      <NewKitListView />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: defaultContainerViewHorizontalPadding
  },
  logoText: {
    justifyContent: 'center',
    color: headerElementColor,
    fontSize: 32,
    fontWeight: 'bold'
  },
  searchBarContainerStyle: {
    width: Dimensions.get('window').width - homeHeaderSearchBarWidthSubtrahend,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 75
  },
  searchBarInputStyle: {},
  addItemButton: {}
})

export default Default
