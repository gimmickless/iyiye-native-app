import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {
  Default as HomeDefault,
  AddressList as HomeAddressList,
  AddressLocationSearch as HomeAddressLocationSearch,
  AddressForm as HomeAddressForm
} from 'screens/home'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { HomeStackScreenNames } from 'types/route'
import { Region } from 'react-native-maps'
import { AuthUserAddressKey } from 'types/context'
import { Scope, TranslateOptions } from 'i18n-js'

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

const HomeStackScreen = (
  t: (scope: Scope, options?: TranslateOptions) => string
) => (
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
        title: t('screen.home.addressList.title')
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

export default HomeStackScreen
