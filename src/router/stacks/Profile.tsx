import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {
  Default as ProfileDefault,
  Settings as ProfileSettings,
  Orders as ProfileOrders,
  Kits as ProfileKits,
  AuditLog as ProfileAuditLog
} from 'screens/common/profile'
import {
  AddressList as ProfileAddressList,
  AddressLocationSearch as ProfileAddressLocationSearch,
  AddressForm as ProfileAddressForm
} from 'screens/common/address'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { AuthUserAddressKey } from 'types/context'
import { Region } from 'react-native-maps'

export enum ProfileStackScreenNames {
  Default = 'ProfileDefault',
  Orders = 'ProfileOrders',
  Kits = 'ProfileKits',
  AuditLog = 'ProfileAuditLog',
  Settings = 'ProfileSettings',
  AddressList = 'ProfileAddressList',
  AddressLocationSearch = 'ProfileAddressLocationSearch',
  AddressForm = 'ProfileAddressForm'
}

export type ProfileStackParamList = {
  ProfileDefault: { username?: string }
  ProfileSettings: { username?: string }
  ProfileOrders: { username?: string }
  ProfileKits: { username?: string }
  ProfileAuditLog: { username?: string }
  ProfileAddressList: { username?: string }
  ProfileAddressLocationSearch: undefined
  ProfileAddressForm:
    | { initialRegion: Region; edit?: { key: AuthUserAddressKey } }
    | undefined
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
          headerTitle: t('screen.common.profile.settings.title')
        }}
      />
      <ProfileStack.Screen
        name={ProfileStackScreenNames.Orders}
        component={ProfileOrders}
        options={{
          headerTitle: t('screen.common.profile.orders.title')
        }}
      />
      <ProfileStack.Screen
        name={ProfileStackScreenNames.Kits}
        component={ProfileKits}
        options={{
          headerTitle: t('screen.common.profile.kits.title')
        }}
      />
      <ProfileStack.Screen
        name={ProfileStackScreenNames.AuditLog}
        component={ProfileAuditLog}
        options={{
          headerTitle: t('screen.common.profile.auditLog.title')
        }}
      />
      <ProfileStack.Screen
        name={ProfileStackScreenNames.AddressList}
        component={ProfileAddressList}
        options={{
          title: t('screen.common.address.list.title')
        }}
      />
      <ProfileStack.Screen
        name={ProfileStackScreenNames.AddressLocationSearch}
        component={ProfileAddressLocationSearch}
        options={{}}
      />
      <ProfileStack.Screen
        name={ProfileStackScreenNames.AddressForm}
        component={ProfileAddressForm}
        options={{}}
      />
    </ProfileStack.Navigator>
  )
}

export default ProfileStackScreen
