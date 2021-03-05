import React, { useContext, useLayoutEffect, useMemo } from 'react'
import { View, StyleSheet, Pressable, Alert } from 'react-native'
import { Text } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { AuthUserContext } from 'contexts/Auth'
import { homeHeaderHeight, textColor } from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { ScrollView } from 'react-native-gesture-handler'
import { MaterialIcons } from '@expo/vector-icons'
import {
  AuthStackScreenNames,
  HomeStackScreenNames,
  TabNames
} from 'types/route'
import LoadingView from 'components/shared/LoadingView'
import { AddressTypeMaterialCommunityIcon } from 'types/visualization'
import {
  ActiveOrderListView,
  CategoryListView,
  CuratedKitListView,
  FaveAndRecentKitListView,
  NewKitListView
} from 'components/home'

const Default: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const { state: authUser } = useContext(AuthUserContext)

  const isAuthUser = useMemo(() => authUser.props ?? undefined, [authUser])
  const username = useMemo(() => authUser.props?.username ?? '', [
    authUser.props?.username
  ])

  const renderHeaderTitle = useMemo(
    () => (
      <View style={styles.headerTitleContainer}>
        <Text h3 style={styles.headerTitlePrimaryText}>
          {isAuthUser
            ? t('screen.home.default.title.auth', {
                username
              })
            : t('screen.home.default.title.unauth')}
          &nbsp;👋
        </Text>
        <Text style={styles.headerTitleSecondaryText}>
          {isAuthUser
            ? t('screen.home.default.subtitle.auth')
            : t('screen.home.default.subtitle.unauth')}
        </Text>
      </View>
    ),
    [isAuthUser, t, username]
  )

  const renderHeaderRight = useMemo(() => {
    const onPress = isAuthUser
      ? () => {
          navigation.navigate(HomeStackScreenNames.AddressList)
        }
      : () => {
          Alert.alert(
            t('screen.home.default.alert.loginToAddAddress.title'),
            t('screen.home.default.alert.loginToAddAddress.message'),
            [
              {
                text: t('common.button.cancel'),
                onPress: () => {
                  return
                },
                style: 'cancel'
              },
              {
                text: t(
                  'screen.home.default.alert.loginToAddAddress.button.ok'
                ),
                onPress: () => {
                  navigation.navigate(TabNames.Auth, {
                    screen: AuthStackScreenNames.SignIn
                  })
                }
              }
            ],
            { cancelable: true }
          )
        }

    let buttonMaterialIcon: string
    let bottomText: string

    if (isAuthUser && authUser.props?.address) {
      const defaultAddress = authUser.props[authUser.props?.address]
      switch (defaultAddress?.kind) {
        case 'current':
          buttonMaterialIcon = AddressTypeMaterialCommunityIcon.Current
          break
        case 'home':
          buttonMaterialIcon = AddressTypeMaterialCommunityIcon.Home
          break
        case 'office':
          buttonMaterialIcon = AddressTypeMaterialCommunityIcon.Office
          break
        default:
          buttonMaterialIcon = AddressTypeMaterialCommunityIcon.Other
          break
      }
      bottomText = defaultAddress?.name ?? ''
    } else {
      buttonMaterialIcon = 'my-location'
      bottomText = t('screen.home.default.button.location.current')
    }

    return (
      <Pressable onPress={onPress} style={styles.headerRightAddressButton}>
        <View style={styles.headerRightAddressButtonInnerContainer}>
          <Text style={styles.headerRightAddressButtonLabelText}>
            {t('screen.home.default.button.location.label')}
          </Text>
          <MaterialIcons
            name={buttonMaterialIcon}
            size={32}
            color={textColor.header.title}
          />
          <Text style={styles.headerRightAddressButtonText}>{bottomText}</Text>
        </View>
      </Pressable>
    )
  }, [authUser.props, isAuthUser, navigation, t])

  // Customize header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { height: homeHeaderHeight, elevation: 0, shadowOpacity: 0 },
      headerTitle: () => renderHeaderTitle,
      headerRight: () => renderHeaderRight
    })
  }, [renderHeaderRight, renderHeaderTitle, navigation])

  return !authUser.loaded ? (
    <LoadingView />
  ) : (
    <ScrollView style={styles.view}>
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
  headerTitleContainer: {
    flex: 1,
    height: 64,
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'center'
  },
  headerTitlePrimaryText: {
    color: textColor.header.title,
    alignContent: 'center'
  },
  headerTitleSecondaryText: {
    color: textColor.header.subtitle
  },
  headerRightAddressButtonLabelText: {
    color: textColor.header.title
  },
  headerRightAddressButtonText: {
    color: textColor.header.title
  },
  headerRightAddressButton: {
    height: 64,
    backgroundColor: 'ghostwhite',
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 16,
    marginRight: 8,
    paddingHorizontal: 8,
    marginVertical: 8
  },
  headerRightAddressButtonInnerContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
})

export default Default
