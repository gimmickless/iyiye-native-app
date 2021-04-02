import React, { useContext, useMemo } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import LoadingView from 'components/shared/LoadingView'
import { LocalizationContext } from 'contexts/Localization'
import { AuthUserContext } from 'contexts/Auth'
import ListSeparator from 'components/shared/ListSeparator'
import { Text, ThemeContext } from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const Profile: React.FC = () => {
  const navigation = useNavigation()
  const { t } = useContext(LocalizationContext)
  const { theme: rneTheme } = useContext(ThemeContext)
  const { state: authUser, action: authUserAction } = useContext(
    AuthUserContext
  )

  const onSignOutPress = () => {
    console.log('Sign out Pressed')
    return
  }

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
    [t]
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
