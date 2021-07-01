import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Default as HomeDefault } from 'screens/home'
import {
  AddressList as HomeAddressList,
  AddressLocationSearch as HomeAddressLocationSearch,
  AddressForm as HomeAddressForm
} from 'screens/common/address'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { Region } from 'react-native-maps'
import { AuthUserAddressKey } from 'types/context'
import { LocalizationContext } from 'contexts/Localization'

export enum HomeStackScreenNames {
  Default = 'HomeDefault',
  AddressList = 'HomeAddressList',
  AddressLocationSearch = 'HomeAddressLocationSearch',
  AddressForm = 'HomeAddressForm'
}

export type HomeStackParamList = {
  HomeDefault: undefined
  HomeAddressList: { changedAddressKey?: AuthUserAddressKey } | undefined
  HomeAddressLocationSearch: undefined
  HomeAddressForm:
    | { initialRegion: Region; edit?: { key: AuthUserAddressKey } }
    | undefined
  HomeList: { sort: 'latest' | 'top' } | undefined
  HomeItem: { id: string }
  HomeAuthor?: { userId: string }
}

const HomeStack = createStackNavigator<HomeStackParamList>()

const HomeStackScreen: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  return (
    <HomeStack.Navigator
      initialRouteName={HomeStackScreenNames.Default}
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
      <HomeStack.Screen
        name={HomeStackScreenNames.Default}
        component={HomeDefault}
      />
      <HomeStack.Screen
        name={HomeStackScreenNames.AddressList}
        component={HomeAddressList}
        options={{
          title: t('screen.common.address.list.title')
        }}
      />
      <HomeStack.Screen
        name={HomeStackScreenNames.AddressLocationSearch}
        component={HomeAddressLocationSearch}
        options={{}}
      />
      <HomeStack.Screen
        name={HomeStackScreenNames.AddressForm}
        component={HomeAddressForm}
        options={{}}
      />
    </HomeStack.Navigator>
  )
}

export default HomeStackScreen
