import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Default as ProfileDefault } from 'screens/profile'
import { Settings as ProfileSettings } from 'screens/profile'
import { Orders as ProfileOrders } from 'screens/profile'
import { Kits as ProfileKits } from 'screens/profile'
import { AuditLog as ProfileAuditLog } from 'screens/profile'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { ProfileStackScreenNames } from 'types/route'
import { LocalizationContext } from 'contexts/Localization'

export type ProfileStackParamList = {
  ProfileDefault: { username?: string }
  ProfileSettings: { username?: string }
  ProfileOrders: { username?: string }
  ProfileKits: { username?: string }
  ProfileAuditLog: { id: string }
}

const ProfileStack = createStackNavigator<ProfileStackParamList>()

const ProfileStackScreen: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  return (
    <ProfileStack.Navigator
      initialRouteName={ProfileStackScreenNames.Default}
      screenOptions={{
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0
        },
        headerLeftContainerStyle: {
          paddingLeft: headerLeftContainerPaddingLeft
        }
      }}
    >
      <ProfileStack.Screen
        name={ProfileStackScreenNames.Default}
        component={ProfileDefault}
        options={{
          headerTitle: ''
        }}
      />
      <ProfileStack.Screen
        name={ProfileStackScreenNames.Settings}
        component={ProfileSettings}
        options={{
          headerTitle: t('screen.profile.settings.title')
        }}
      />
      <ProfileStack.Screen
        name={ProfileStackScreenNames.Orders}
        component={ProfileOrders}
        options={{
          headerTitle: t('screen.profile.orders.title')
        }}
      />
      <ProfileStack.Screen
        name={ProfileStackScreenNames.Kits}
        component={ProfileKits}
        options={{
          headerTitle: t('screen.profile.kits.title')
        }}
      />
      <ProfileStack.Screen
        name={ProfileStackScreenNames.AuditLog}
        component={ProfileAuditLog}
        options={{
          headerTitle: t('screen.profile.auditLog.title')
        }}
      />
    </ProfileStack.Navigator>
  )
}

export default ProfileStackScreen
