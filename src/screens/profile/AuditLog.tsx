import React, { useContext } from 'react'
import { StyleSheet, SafeAreaView } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { LocalizationContext } from 'contexts/Localization'
import { AuthUserContext } from 'contexts/Auth'
import { ThemeContext } from 'react-native-elements'
import { ProfileStackParamList } from 'router/stacks/Profile'
import { useInAppMessage } from 'contexts/InAppMessage'

export type ProfileAuditLogRouteProps = RouteProp<
  ProfileStackParamList,
  'ProfileAuditLog'
>

const AuditLog: React.FC = () => {
  const navigation = useNavigation()
  const { t } = useContext(LocalizationContext)
  const route = useRoute<ProfileAuditLogRouteProps>()
  const { theme: rneTheme } = useContext(ThemeContext)
  const { addInAppMessage } = useInAppMessage()
  const { state: authUser, action: authUserAction } =
    useContext(AuthUserContext)

  const authUsername = authUser.props?.username
  const profileUsername = route.params?.username ?? authUsername
  const isOwnProfile = authUsername === profileUsername

  return <SafeAreaView style={styles.view}></SafeAreaView>
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  }
})

export default AuditLog
