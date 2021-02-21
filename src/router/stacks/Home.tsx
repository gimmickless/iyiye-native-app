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

type HomeStackParamList = {
  HomeDefault: undefined
  HomeAddressList: undefined
  HomeAddressLocationSearch: undefined
  HomeAddressForm: undefined
  HomeList: { sort: 'latest' | 'top' } | undefined
  HomeItem: { id: string }
  HomeAuthor?: { userId: string }
}

const HomeStack = createStackNavigator<HomeStackParamList>()

const HomeStackScreen = (t: Function) => (
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
