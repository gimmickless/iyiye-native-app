import React, { useContext, useEffect, useState } from 'react'
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native'
import { Text, ThemeContext } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import ListSeparator from 'components/shared/ListSeparator'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LocalizationContext } from 'contexts/Localization'
import API, { graphqlOperation } from '@aws-amplify/api'
import { AuthUserContext } from 'contexts/Auth'
import LoadingView from 'components/shared/LoadingView'

const getNotificationItemIconName = (type?: string) => {
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
  const { state: authUser } = useContext(AuthUserContext)
  const { theme: rneTheme } = useContext(ThemeContext)

  const [dataLoading, setDataLoading] = useState(false)
  const [notifications, setNotifications] = useState<Array<any>>([])

  useEffect(() => {
    if (!authUser.props) return
    !(async () => {
      try {
        setDataLoading(true)
        const liveStreamsGraphqlResponse = (await API.graphql(
          graphqlOperation(ListNotifications, {
            limit: itemsPerFetch
          })
        )) as {
          data: ListLiveStreamsForInfoCardQuery
        }
        const listNotificationsResult =
          liveStreamsGraphqlResponse.data.listLiveStreams
        setNotifications(listNotificationsResult)
      } catch (err) {
        addInAppMessage({
          message: err,
          type: 'error'
        })
      } finally {
        setDataLoading(false)
      }
    })()
  }, [])

  return !authUser.loaded || dataLoading ? (
    <LoadingView />
  ) : (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.listContainer}
        data={notifications}
        renderItem={({ item }) => {
          return (
            <View style={styles.listItem}>
              <View style={styles.listItemTypeIconField}>
                <MaterialCommunityIcons
                  name={getNotificationItemIconName(item.value?.type)}
                  size={25}
                  color={rneTheme.colors?.grey2}
                />
              </View>
              <View style={styles.listItemMainField}>
                <Text>{item.value?.routeAddress}</Text>
              </View>
            </View>
          )
        }}
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
