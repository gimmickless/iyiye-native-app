import React, { useContext, useLayoutEffect, useMemo, useState } from 'react'
import { View, StyleSheet, Pressable, Alert } from 'react-native'
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
  const [carouselEntries] = useState([
    {
      title: 'Some stuff we beg the user to see',
      backgroundColor: 'darkorchid',
      textColor: 'white'
    }
  ])

  const isAuthUser = useMemo(() => authUser.props ?? undefined, [authUser])
  const username = useMemo(
    () => authUser.props?.username ?? '',
    [authUser.props?.username]
  )

  // const renderAddressButton = useMemo(() => {
  //   const onPress = isAuthUser
  //     ? () => {
  //         navigation.navigate('AddressList' as keyof HomeStackParamList)
  //       }
  //     : () => {
  //         Alert.alert(
  //           t('screen.home.default.alert.loginToAddAddress.title'),
  //           t('screen.home.default.alert.loginToAddAddress.message'),
  //           [
  //             {
  //               text: t('common.button.cancel'),
  //               onPress: () => {
  //                 return
  //               },
  //               style: 'cancel'
  //             },
  //             {
  //               text: t(
  //                 'screen.home.default.alert.loginToAddAddress.button.ok'
  //               ),
  //               onPress: () => {
  //                 navigation.navigate(BottomTabNames.Auth, {
  //                   screen: 'SignIn' as keyof AuthStackParamList
  //                 })
  //               }
  //             }
  //           ],
  //           { cancelable: true }
  //         )
  //       }

  //   let buttonMaterialIcon: string
  //   let bottomText: string

  //   if (isAuthUser && authUser.props?.address) {
  //     const defaultAddress = authUser.props[authUser.props?.address]
  //     switch (defaultAddress?.kind) {
  //       case 'home':
  //         buttonMaterialIcon = AddressTypeMaterialCommunityIcon.Home
  //         break
  //       case 'office':
  //         buttonMaterialIcon = AddressTypeMaterialCommunityIcon.Office
  //         break
  //       default:
  //         buttonMaterialIcon = AddressTypeMaterialCommunityIcon.Other
  //         break
  //     }
  //     bottomText = defaultAddress?.routeAddress ?? ''
  //   } else {
  //     buttonMaterialIcon = 'my-location'
  //     bottomText = t('screen.home.default.button.location.current')
  //   }

  //   return (
  //     <Pressable onPress={onPress} style={styles.headerRightAddressButton}>
  //       <View style={styles.headerRightAddressButtonInnerContainer}>
  //         <Text style={styles.headerRightAddressButtonLabelText}>
  //           {t('screen.home.default.button.location.label')}
  //         </Text>
  //         <MaterialIcons
  //           name={buttonMaterialIcon}
  //           size={32}
  //           color={rneTheme.colors?.grey0}
  //         />
  //         <Text style={styles.headerRightAddressButtonText}>{bottomText}</Text>
  //       </View>
  //     </Pressable>
  //   )
  // }, [authUser.props, isAuthUser, navigation, rneTheme.colors?.grey0, t])

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
        layout={'default'}
        data={carouselEntries}
        renderItem={({ item }) => {
          return (
            <View
              style={{
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
          )
        }}
      />
      {/* Kits */}
      {isAuthUser && <ActiveOrderListView username={username} />}
      <CategoryListView username={username} />
      <CuratedKitListView username={username} />
      {isAuthUser && <FaveAndRecentKitListView username={username} />}
      <NewKitListView />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  searchBarContainerStyle: {
    backgroundColor: 'transparent'
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
