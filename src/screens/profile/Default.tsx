import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  Alert,
  Platform
} from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import LoadingView from 'components/shared/LoadingView'
import { LocalizationContext } from 'contexts/Localization'
import { AuthUserContext } from 'contexts/Auth'
import ListSeparator from 'components/shared/ListSeparator'
import { Avatar, Text, ThemeContext } from 'react-native-elements'
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

export type ProfileDefaultRouteProps = RouteProp<
  ProfileStackParamList,
  'ProfileDefault'
>

const requestMediaLibraryPermissionsAsync = async (
  t: (scope: I18n.Scope, options?: I18n.TranslateOptions | undefined) => string
) => {
  if (Platform.OS !== 'web') {
    const {
      status: mediaLibraryPermissionStatus
    } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (mediaLibraryPermissionStatus !== 'granted') {
      throw new Error(
        t(
          'screen.profile.default.alert.mediaLibraryPermissionNotGranted.message'
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
  const [avatarImage, setAvatarImage] = useState(null)
  const { state: authUser, action: authUserAction } = useContext(
    AuthUserContext
  )
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

  const listItems = useMemo(
    () => [
      {
        key: 'logout',
        value: {
          title: t('screen.profile.default.list.signOut'),
          iconName: 'logout',
          color: undefined
        },
        action: () => onSignOutPress()
      }
    ],
    [onSignOutPress, t]
  )

  const onChangeAvatar = async () => {
    if (!profileUsername) return
    try {
      await requestMediaLibraryPermissionsAsync(t)

      const imagePickResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1
      })

      if (imagePickResult.cancelled) return

      console.log('currentCredentials')
      const resasd = await Auth.currentCredentials()
      console.log(resasd)

      const storagePutResult = await Storage.put(
        profileUsername,
        imagePickResult.uri,
        {
          level: 'protected',
          customPrefix: 'protected/avatar/'
        }
      )
      console.log(JSON.stringify(storagePutResult))

      // if (!result.cancelled) {
      //   setImage(result.uri)
      //   // TODO: Upload Image to S3

      //   // TODO: Update user data ['picture'] as the resulting S3 url
      // }
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
        <Avatar
          size="large"
          rounded
          icon={{ name: 'account', type: 'material-community' }}
          containerStyle={{ backgroundColor: rneTheme.colors?.grey1 }}
          source={
            profileUserProps?.picture
              ? { uri: profileUserProps.picture }
              : undefined
          }
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
      <Text h4 style={styles.usernameText}>
        {profileUsername}
      </Text>
      <FlatList
        style={styles.listContainer}
        data={listItems}
        renderItem={({ item }) => (
          <Pressable onPress={item.action}>
            <View style={styles.listItem}>
              <View style={styles.listItemTypeIconField}>
                <MaterialCommunityIcons
                  name={item.value?.iconName}
                  size={25}
                  color={item.value?.color ?? rneTheme.colors?.grey0}
                />
              </View>
              <View style={styles.listItemMainField}>
                <Text
                  style={[
                    styles.listItemMainFieldText,
                    {
                      color: item.value?.color ?? rneTheme.colors?.grey0
                    }
                  ]}
                >
                  {item.value?.title}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.key}
        ItemSeparatorComponent={ListSeparator}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  userInfoContainer: {
    alignItems: 'center'
  },
  usernameText: {
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
