import React, {
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
  Platform,
  ScrollView,
  Pressable,
  FlatList
} from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import LoadingView from 'components/shared/LoadingView'
import { LocalizationContext } from 'contexts/Localization'
import { AuthUserContext } from 'contexts/Auth'
import { Avatar, Chip, Text, ThemeContext } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { HomeStackScreenNames, ProfileStackScreenNames } from 'types/route'
import { ProfileStackParamList } from 'router/stacks/Profile'
import NotFoundView from 'components/shared/NotFoundView'
import { GuestNotAllowedView } from 'components/auth'
import API, { graphqlOperation } from '@aws-amplify/api'
import { getUserBasicInfo } from 'graphql/queries'
import { GetUserBasicInfoQuery, GetUserBasicInfoQueryVariables } from 'API'
import { useInAppMessage } from 'contexts/InAppMessage'
import { AuthUserState } from 'types/context'
import { Storage } from '@aws-amplify/storage'
import {
  defaultContainerViewHorizontalPadding,
  defaultListVerticalPadding,
  getUserAvatarUrl
} from 'utils/constants'

export type ProfileDefaultRouteProps = RouteProp<
  ProfileStackParamList,
  'Default'
>

interface ListItemProps {
  isPublic: boolean
  icon: {
    name: string
    color: string
  }
  title: string
  onPress: () => void
}

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
          'screen.common.profile.default.alert.mediaLibraryPermissionNotGranted.message'
        )
      )
    }
  }
}

const Profile: React.FC = () => {
  const navigation = useNavigation()
  const { t } = useContext(LocalizationContext)
  const route = useRoute<ProfileDefaultRouteProps>()
  const { theme: rneTheme } = useContext(ThemeContext)
  const { addInAppMessage } = useInAppMessage()
  const [avatarImageUrl, setAvatarImageUrl] = useState<string | undefined>(
    undefined
  )
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

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerStyle: { height: homeHeaderHeight, elevation: 0, shadowOpacity: 0 },
      headerRight: () => (
        <View style={styles.headerRightButtonGroup}>
          {/* TODO: Share Profile Button */}
          {isOwnProfile ? (
            <Pressable
              onPress={() => {
                navigation.navigate(ProfileStackScreenNames.Settings)
              }}
            >
              <MaterialCommunityIcons name="dots-horizontal-circle" size={23} />
            </Pressable>
          ) : undefined}
        </View>
      )
    })
  }, [isOwnProfile, navigation])

  useEffect(() => {
    !(async () => {
      try {
        // Collect initial user info to display
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
      // Load profile picture
      try {
        const signedUrl = await Storage.get(profileUsername, {
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

  const optionList = useMemo(
    () =>
      [
        {
          isPublic: false,
          icon: {
            name: 'shopping',
            color: 'tomato'
          },
          title: t('screen.common.profile.default.list.orders'),
          onPress: () => navigation.navigate(ProfileStackScreenNames.Orders)
        },
        {
          isPublic: true,
          icon: {
            name: 'apps-box',
            color: 'blueviolet'
          },
          title: t('screen.common.profile.default.list.kits'),
          onPress: () => navigation.navigate(ProfileStackScreenNames.Kits)
        },
        {
          isPublic: false,
          icon: {
            name: 'map-marker-radius',
            color: 'mediumvioletred'
          },
          title: t('screen.common.profile.default.list.addresses'),
          onPress: () => navigation.navigate(HomeStackScreenNames.AddressList)
        },
        {
          isPublic: false,
          icon: {
            name: 'sine-wave',
            color: 'deepskyblue'
          },
          title: t('screen.common.profile.default.list.auditLog'),
          onPress: () => navigation.navigate(ProfileStackScreenNames.AuditLog)
        }
      ] as Array<ListItemProps>,
    [navigation, t]
  )

  if (!authUser.loaded) return <LoadingView />
  if (!authUser.props) return <GuestNotAllowedView />
  if (!profileUsername) return <NotFoundView />
  return (
    <SafeAreaView style={styles.view}>
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
      {/* TODO: Calculate badges (with a lambda function and cache it maybe) */}
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
            color: 'springgreen'
          }}
          titleStyle={{ color: 'springgreen', fontSize: 14 }}
          buttonStyle={{ borderColor: 'springgreen' }}
        />
      </ScrollView>
      {/* TODO: OptionList */}
      <View style={{ marginVertical: defaultContainerMargin }}>
        <FlatList
          data={
            isOwnProfile ? optionList : optionList.filter((el) => el.isPublic)
          }
          renderItem={({ item }) => (
            <Pressable onPress={item.onPress}>
              <View style={styles.listItemContainer}>
                <View style={styles.listItem}>
                  <MaterialCommunityIcons
                    name={item.icon.name}
                    size={24}
                    color={item.icon.color}
                  />
                  <Text style={styles.listItemTitle}>{item.title}</Text>
                </View>
                <View style={styles.listItemDetail}>
                  <Text
                    style={[
                      styles.listItemTitle,
                      { color: rneTheme.colors?.grey1 }
                    ]}
                  >
                    {0}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
          keyExtractor={(item, index) => item.title + index}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: defaultContainerViewHorizontalPadding
  },
  headerRightButtonGroup: {
    flexDirection: 'row'
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
  listContainer: {},
  listItemContainer: {
    flexDirection: 'row',
    paddingVertical: defaultListVerticalPadding,
    justifyContent: 'space-between'
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  listItemTitle: {
    marginLeft: 12,
    fontSize: 22
  },
  listItemDetail: {
    alignItems: 'center',
    justifyContent: 'flex-end'
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
