import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
  ScrollView
} from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import LoadingView from 'components/shared/LoadingView'
import { LocalizationContext } from 'contexts/Localization'
import { AuthUserContext } from 'contexts/Auth'
import { Avatar, Chip, Text, ThemeContext } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { HomeStackScreenNames, TabNames } from 'types/route'
import { ProfileStackParamList } from 'router/stacks/Profile'
import NotFoundView from 'components/shared/NotFoundView'
import { GuestNotAllowedView } from 'components/auth'
import API, { graphqlOperation } from '@aws-amplify/api'
import { getUserBasicInfo } from 'graphql/queries'
import { GetUserBasicInfoQuery, GetUserBasicInfoQueryVariables } from 'API'
import { useInAppMessage } from 'contexts/InAppMessage'
import { AuthUserState } from 'types/context'
import { Storage } from '@aws-amplify/storage'
import { Auth } from '@aws-amplify/auth'
import { getUserAvatarUrl } from 'utils/constants'
import {
  defaultOnOverflowMenuPress,
  HeaderButtons,
  HiddenItem,
  OverflowMenu
} from 'react-navigation-header-buttons'
import { SceneMap, TabView } from 'react-native-tab-view'

export type ProfileDefaultRouteProps = RouteProp<
  ProfileStackParamList,
  'ProfileDefault'
>

const defaultContainerMargin = 8
const protectedAvatarFolderCustomPrefix = 'protected/avatar/'

const requestMediaLibraryPermissionsAsync = async (
  t: (scope: I18n.Scope, options?: I18n.TranslateOptions | undefined) => string
) => {
  if (Platform.OS !== 'web') {
    const { status: mediaLibraryPermissionStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (mediaLibraryPermissionStatus !== 'granted') {
      throw new Error(
        t(
          'screen.profile.default.alert.mediaLibraryPermissionNotGranted.message'
        )
      )
    }
  }
}

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#ff4081' }}>
    <Text>Asdsad1</Text>
  </View>
)

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#673ab7' }}>
    <Text>Asdsad2</Text>
  </View>
)

const Profile: React.FC = () => {
  const navigation = useNavigation()
  const { t } = useContext(LocalizationContext)
  const route = useRoute<ProfileDefaultRouteProps>()
  const { theme: rneTheme } = useContext(ThemeContext)
  const { addInAppMessage } = useInAppMessage()
  const [avatarImageUrl, setAvatarImageUrl] = useState<string | undefined>(
    undefined
  )
  const [tabIndex, setTabIndex] = useState(0)
  const [tabRoutes] = useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' }
  ])
  const { state: authUser, action: authUserAction } =
    useContext(AuthUserContext)
  const [profileUserProps, setProfileUserProps] = useState<
    | AuthUserState['props']
    | GetUserBasicInfoQuery['getUserBasicInfo']
    | undefined
  >(undefined)

  const authUsername = authUser.props?.username
  const profileUsername = route.params?.username ?? authUsername
  const isOwnProfile = authUsername === profileUsername

  const onSignOutPress = useCallback(() => {
    Alert.alert(
      t('screen.profile.default.alert.signOutConfirmation.title'),
      t('screen.profile.default.alert.signOutConfirmation.message'),
      [
        {
          text: t('common.button.cancel'),
          onPress: () => {
            return
          },
          style: 'cancel'
        },
        {
          text: t('screen.profile.default.alert.signOutConfirmation.okButton'),
          onPress: async () => {
            await authUserAction.logout()
            navigation.navigate(HomeStackScreenNames.Default)
          }
        }
      ],
      { cancelable: true }
    )
  }, [authUserAction, navigation, t])

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerStyle: { height: homeHeaderHeight, elevation: 0, shadowOpacity: 0 },
      headerRight: () => (
        <HeaderButtons>
          <OverflowMenu
            OverflowIcon={({ color }) => (
              <MaterialCommunityIcons
                name="dots-vertical"
                size={23}
                color={color}
              />
            )}
            onPress={(params) => {
              defaultOnOverflowMenuPress({
                ...params,
                cancelButtonLabel: t(
                  'screen.profile.default.menu.options.cancel'
                )
              })
            }}
          >
            <HiddenItem
              title={t('screen.profile.default.menu.options.signOut')}
              onPress={onSignOutPress}
            />
          </OverflowMenu>
        </HeaderButtons>
      )
    })
  }, [navigation, onSignOutPress, t])

  useEffect(() => {
    !(async () => {
      try {
        if (isOwnProfile) {
          setProfileUserProps(authUser.props)
        } else {
          const getUserInfoRequest = API.graphql(
            graphqlOperation(getUserBasicInfo, {
              username: authUser.props?.username
            } as GetUserBasicInfoQueryVariables)
          ) as PromiseLike<{
            data: GetUserBasicInfoQuery
          }>
          const [getUserInfoAppSyncResponse] = (await Promise.all([
            getUserInfoRequest
          ])) as [{ data: GetUserBasicInfoQuery }]
          const getUserInfoResult =
            getUserInfoAppSyncResponse.data.getUserBasicInfo ?? undefined
          setProfileUserProps(getUserInfoResult)
        }
      } catch (err) {
        addInAppMessage({
          message: err.message ?? err,
          type: 'error'
        })
      }
    })()
  }, [addInAppMessage, authUser.props, isOwnProfile, setProfileUserProps])

  useEffect(() => {
    if (!profileUsername) return
    !(async () => {
      try {
        const signedUrl = await Storage.get(profileUsername, {
          // cacheControl: 'no-cache',
          contentType: 'image/*',
          level: 'protected',
          identityId: profileUserProps?.identityId,
          customPrefix: {
            protected: protectedAvatarFolderCustomPrefix
          }
        })
        setAvatarImageUrl(signedUrl.toString())
      } catch (err) {
        addInAppMessage({
          message: err.message ?? err,
          type: 'error'
        })
      }
    })()
  }, [addInAppMessage, profileUserProps?.identityId, profileUsername])

  const onChangeAvatar = async () => {
    if (!profileUsername) return
    try {
      await requestMediaLibraryPermissionsAsync(t)

      const imagePickResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1
      })

      if (imagePickResult.cancelled) return

      const response = await fetch(imagePickResult.uri)
      const blob = await response.blob()
      await Storage.put(profileUsername, blob, {
        contentType: 'image/*',
        level: 'protected',
        customPrefix: {
          protected: protectedAvatarFolderCustomPrefix
        }
      })
      setAvatarImageUrl(imagePickResult.uri)

      // TODO: Actually the avatar URL kept in the Cognito is useless as Storage does not take urls
      await authUserAction.update({
        ...authUser.props,
        fullName: authUser.props?.fullName ?? '',
        picture: getUserAvatarUrl(
          authUser.props?.identityId ?? '',
          profileUsername
        )
      })
    } catch (err) {
      console.log('Err: ' + JSON.stringify(err))
      addInAppMessage({
        message: JSON.stringify(err),
        type: 'error'
      })
    }
    return
  }

  if (!authUser.loaded) {
    return <LoadingView />
  }

  if (!authUser.props) {
    return <GuestNotAllowedView />
  }

  if (!profileUsername) {
    return <NotFoundView />
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoContainer}>
        {/* Profile Picture */}
        <Avatar
          size="large"
          rounded
          icon={{ name: 'account', type: 'material-community' }}
          containerStyle={{ backgroundColor: rneTheme.colors?.grey1 }}
          source={avatarImageUrl ? { uri: avatarImageUrl } : undefined}
        >
          {isOwnProfile && (
            <Avatar.Accessory
              onPress={onChangeAvatar}
              size={25}
              type="material-community"
              name="pencil"
            />
          )}
        </Avatar>
      </View>
      {/* Username */}
      <Text h4 style={styles.usernameText}>
        {profileUsername}
      </Text>
      {/* Bio */}
      <Text style={styles.bioText}>{authUser.props.bio ?? '{No bio}'}</Text>
      {/* TODO: Badges */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          marginVertical: defaultContainerMargin,
          marginLeft: defaultContainerMargin
        }}
      >
        <Chip
          title="Fossil"
          type="outline"
          icon={{
            name: 'bone',
            type: 'material-community',
            size: 20,
            color: 'pink'
          }}
          titleStyle={{ color: 'pink', fontSize: 14 }}
          buttonStyle={{ borderColor: 'pink' }}
        />
      </ScrollView>
      {/* TODO: Tabs */}

      <View style={{ marginVertical: defaultContainerMargin }}>
        <TabView
          navigationState={{ index: tabIndex, routes: tabRoutes }}
          onIndexChange={setTabIndex}
          renderScene={SceneMap({
            first: FirstRoute,
            second: SecondRoute
          })}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  userInfoContainer: {
    alignItems: 'center'
  },
  usernameText: {
    alignSelf: 'center'
  },
  bioText: {
    alignSelf: 'center'
  },
  listContainer: { paddingHorizontal: 8 },
  listItem: {
    flex: 1,
    flexDirection: 'row'
  },
  listItemTypeIconField: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItemMainField: {
    flex: 6
  },
  listItemMainFieldText: {
    fontSize: 22
  }
})

export default Profile
