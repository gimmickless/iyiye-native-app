import React, { useCallback, useContext, useEffect, useState } from 'react'
import { FlatList, SafeAreaView, StyleSheet, View, Image } from 'react-native'
import { Text, ThemeContext } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import ListSeparator from 'components/shared/ListSeparator'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LocalizationContext } from 'contexts/Localization'
import API, { graphqlOperation } from '@aws-amplify/api'
import { AuthUserContext } from 'contexts/Auth'
import LoadingView from 'components/shared/LoadingView'
import {
  ListInAppNotificationsForUserQuery,
  ListInAppNotificationsForUserQueryVariables
} from 'API'
import { listInAppNotificationsForUser } from 'graphql/queries'
import { defaultLoadItemLimit } from 'utils/constants'
import { TabBarBadgeContext } from 'contexts/TabBarBadge'

// interface ListInAppNotificationsForUserAppSyncResult
//   extends Omit<
//     Exclude<
//       ListInAppNotificationsForUserQuery['listInAppNotificationsForUser'],
//       null
//     >,
//     '__typename'
//   > {}

const getNotificationItemIconName = (type: string | undefined | null) => {
  if (!type) return 'map-marker-question'
  switch (type) {
    case 'announcement':
      return 'bullhorn'
    case 'promotion':
      return 'sale'
    case 'report':
      return 'file-document'
    case 'comment':
      return 'comment'
    case 'star':
      return 'star'
    case 'flag':
      return 'flag'
    default:
      return 'alien'
  }
}

const Default: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const { tabCount, setTabCount } = useContext(TabBarBadgeContext)
  const { state: authUser } = useContext(AuthUserContext)
  const { theme: rneTheme } = useContext(ThemeContext)

  const [dataLoading, setDataLoading] = useState(false)
  const [notificationDataOffset, setNotificationDataOffset] = useState(0)
  const [notifications, setNotifications] = useState<
    Exclude<
      ListInAppNotificationsForUserQuery['listInAppNotificationsForUser'],
      null
    >
  >([])

  const fetchNotifications = useCallback(async () => {
    try {
      setDataLoading(true)

      const listInAppNotificationsForUserAppSyncRequest = API.graphql(
        graphqlOperation(listInAppNotificationsForUser, {
          username: authUser.props?.username,
          limit: defaultLoadItemLimit,
          offset: notificationDataOffset
        } as ListInAppNotificationsForUserQueryVariables)
      ) as PromiseLike<{
        data: ListInAppNotificationsForUserQuery
      }>

      const [
        listInAppNotificationsForUserAppSyncResponse
      ] = (await Promise.all([
        listInAppNotificationsForUserAppSyncRequest
      ])) as [{ data: ListInAppNotificationsForUserQuery }]
      const listInAppNotificationsForUserResult =
        listInAppNotificationsForUserAppSyncResponse.data
          .listInAppNotificationsForUser ?? []
      setNotificationDataOffset(notificationDataOffset + defaultLoadItemLimit)
      setNotifications([
        ...notifications,
        ...listInAppNotificationsForUserResult
      ])
    } catch (err) {
      addInAppMessage({
        message: err,
        type: 'error'
      })
    } finally {
      setDataLoading(false)
    }
  }, [authUser.props?.username, notificationDataOffset, notifications])

  useEffect(() => {
    setTabCount({
      ...tabCount,
      notification: 0
    })
    if (!authUser.props) return
    fetchNotifications()
  }, [authUser.props, fetchNotifications, setTabCount, tabCount])

  return !authUser.loaded ? (
    <LoadingView />
  ) : (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.listContainer}
        data={notifications}
        onEndReached={fetchNotifications}
        renderItem={({ item }) => {
          return (
            <View style={styles.listItem}>
              <View style={styles.listItemTypeIconField}>
                <MaterialCommunityIcons
                  name={getNotificationItemIconName(item?.type)}
                  size={25}
                  color={rneTheme.colors?.grey2}
                />
              </View>
              <View style={styles.listItemMainField}>
                <Text>{item?.body}</Text>
              </View>
            </View>
          )
        }}
        keyExtractor={(item) => item?.id ?? ''}
        ItemSeparatorComponent={ListSeparator}
        ListEmptyComponent={() => (
          <Image source={require('visuals/notfound.png')} />
        )}
        refreshing={dataLoading}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  listContainer: { paddingHorizontal: 8 },
  listItem: {
    flex: 1,
    flexDirection: 'row'
  },
  listItemTypeIconField: {
    flex: 1,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItemMainField: {
    flex: 7
  }
})
function addInAppMessage(arg0: { message: any; type: string }) {
  throw new Error('Function not implemented.')
}
