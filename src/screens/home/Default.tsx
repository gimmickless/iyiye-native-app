import React, { useContext, useLayoutEffect, useMemo, useState } from 'react'
import {
  View,
  StyleSheet,
  Pressable,
  Alert,
  useWindowDimensions
} from 'react-native'
import { Button, SearchBar, Text, ThemeContext } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { useAuthUser } from 'contexts/Auth'
import {
  defaultContainerViewHorizontalPadding,
  homeHeaderHeight
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
import { HomeStackParamList } from 'router/stacks/Home'

const Default: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
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
      headerLeft: () => <Text style={styles.logoText}>###</Text>,
      headerTitle: () => (
        <Pressable
          onPress={() =>
            navigation.navigate('Search' as keyof HomeStackParamList)
          }
          style={{
            backgroundColor: 'powderblue'
          }}
        >
          <SearchBar
            pointerEvents="none"
            onChangeText={(val: string) => {
              return
            }}
            value=""
            editable={false}
            containerStyle={styles.searchBarContainerStyle}
            inputStyle={{
              ...styles.searchBarInputStyle,
              color: rneTheme.colors?.black
            }}
            autoCorrect={false}
            placeholder={t('screen.home.default.placeholder.search')}
          />
        </Pressable>
      ),
      headerRight: isAuthUser
        ? () => (
            <Button
              type="clear"
              icon={
                <MaterialCommunityIcons
                  name="plus"
                  size={15}
                  color={rneTheme.colors?.primary}
                />
              }
              title={t('screen.home.default.button.create')}
              onPress={() => Alert.alert('TODO: Navigate to Add new kit page')}
            />
          )
        : undefined
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
    color: 'tomato',
    fontSize: 32,
    fontWeight: 'bold'
  },
  searchBarContainerStyle: {
    // minWidth: 200,
    width: 'auto',
    backgroundColor: 'transparent'
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 75
  },
  searchBarInputStyle: {}
})

export default Default
