import React, { useCallback, useContext, useMemo } from 'react'
import {
  View,
  StyleSheet,
  SectionList,
  SafeAreaView,
  Text,
  Alert
} from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { AuthUserContext } from 'contexts/Auth'
import { LocalizationContext } from 'contexts/Localization'
import { RootStackParamList } from 'router'
import { HomeStackParamList } from 'router/DefaultTabScreens'

export type ProfileSettingsRouteProps = RouteProp<
  RootStackParamList,
  'ProfileSettings'
>

const Item = ({ title }: { title: string }) => (
  <View style={styles.listItem}>
    <Text style={styles.listItemTitle}>{title}</Text>
  </View>
)

const Settings: React.FC = () => {
  const navigation = useNavigation()
  const { t } = useContext(LocalizationContext)
  const route = useRoute<ProfileSettingsRouteProps>()
  const { state: authUser, action: authUserAction } =
    useContext(AuthUserContext)

  const onSignOutPress = useCallback(() => {
    Alert.alert(
      t('screen.common.profile.settings.alert.signOutConfirmation.title'),
      t('screen.common.profile.settings.alert.signOutConfirmation.message'),
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
            'screen.common.profile.settings.alert.signOutConfirmation.okButton'
          ),
          onPress: async () => {
            await authUserAction.logout()
            navigation.navigate('HomeDefault' as keyof HomeStackParamList)
          }
        }
      ],
      { cancelable: true }
    )
  }, [authUserAction, navigation, t])

  const sectionData = useMemo(() => {
    return [
      {
        title: t(''),
        data: [
          {
            title: t(''),
            onPress: onSignOutPress
          }
        ]
      }
    ]
  }, [onSignOutPress, t])

  return (
    <SafeAreaView style={styles.view}>
      <SectionList
        sections={sectionData}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item title={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  sectionHeader: {
    fontSize: 18
  },
  listItem: {
    padding: 20,
    marginVertical: 8
  },
  listItemTitle: {
    fontSize: 24
  }
})

export default Settings
