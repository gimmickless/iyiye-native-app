import React, { useContext } from 'react'
import {
  CardStyleInterpolators,
  createStackNavigator
} from '@react-navigation/stack'
import {
  Default,
  Settings,
  Orders,
  Kits,
  AuditLog
} from 'screens/common/profile'
import {
  AddressList,
  AddressLocationSearch,
  AddressForm
} from 'screens/common/address'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { AuthUserAddressKey } from 'types/context'
import { Region } from 'react-native-maps'

export type ProfileStackParamList = {
  Default: { username?: string }
  Settings: { username?: string }
  Orders: { username?: string }
  Kits: { username?: string }
  AuditLog: { username?: string }
  AddressList: { username?: string }
  AddressLocationSearch: undefined
  AddressForm:
    | { initialRegion: Region; edit?: { key: AuthUserAddressKey } }
    | undefined
}

const ProfileStack = createStackNavigator<ProfileStackParamList>()

const ProfileStackScreen: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  return (
    <ProfileStack.Navigator
      initialRouteName="Default"
      screenOptions={{
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0
        },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerLeftContainerStyle: {
          paddingLeft: headerLeftContainerPaddingLeft
        }
      }}
    >
      <ProfileStack.Screen
        name="Default"
        component={Default}
        options={{
          headerTitle: '',
          headerTransparent: true
        }}
      />
      <ProfileStack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerTitle: t('screen.common.profile.settings.title')
        }}
      />
      <ProfileStack.Screen
        name="Orders"
        component={Orders}
        options={{
          headerTitle: t('screen.common.profile.orders.title')
        }}
      />
      <ProfileStack.Screen
        name="Kits"
        component={Kits}
        options={{
          headerTitle: t('screen.common.profile.kits.title')
        }}
      />
      <ProfileStack.Screen
        name="AuditLog"
        component={AuditLog}
        options={{
          headerTitle: t('screen.common.profile.auditLog.title')
        }}
      />
      <ProfileStack.Screen
        name="AddressList"
        component={AddressList}
        options={{
          title: t('screen.common.address.list.title')
        }}
      />
      <ProfileStack.Screen
        name="AddressLocationSearch"
        component={AddressLocationSearch}
        options={{}}
      />
      <ProfileStack.Screen
        name="AddressForm"
        component={AddressForm}
        options={{}}
      />
    </ProfileStack.Navigator>
  )
}

export default ProfileStackScreen
