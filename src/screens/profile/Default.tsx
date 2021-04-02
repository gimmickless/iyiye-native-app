import React, { useCallback, useContext, useMemo } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  Alert
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import LoadingView from 'components/shared/LoadingView'
import { LocalizationContext } from 'contexts/Localization'
import { AuthUserContext } from 'contexts/Auth'
import ListSeparator from 'components/shared/ListSeparator'
import { Text, ThemeContext } from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { HomeStackScreenNames, TabNames } from 'types/route'

const Profile: React.FC = () => {
  const navigation = useNavigation()
  const { t } = useContext(LocalizationContext)
  const { theme: rneTheme } = useContext(ThemeContext)
  const { state: authUser, action: authUserAction } = useContext(
    AuthUserContext
  )

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

  return !authUser.loaded ? (
    <LoadingView />
  ) : (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.listContainer}
        data={listItems}
        renderItem={({ item }) => {
          return (
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
