import React, { useContext } from 'react'
import {
  CardStyleInterpolators,
  createStackNavigator
} from '@react-navigation/stack'
import { Default, KitDetailModal, Search } from 'screens/home'
import {
  AddressList,
  AddressLocationSearch,
  AddressForm
} from 'screens/common/address'

import { Default as AuthorProfileDefault } from 'screens/common/profile'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { Region } from 'react-native-maps'
import { AuthUserAddressKey } from 'types/context'
import { LocalizationContext } from 'contexts/Localization'

export type HomeStackParamList = {
  Default: undefined
  Search: undefined
  AddressList: { changedAddressKey?: AuthUserAddressKey } | undefined
  AddressLocationSearch: undefined
  AddressForm:
    | { initialRegion: Region; edit?: { key: AuthUserAddressKey } }
    | undefined
  KitDefault: { id: string } | undefined
  AuthorProfileDefault: { username?: string }
  AuthorProfileKits: { username?: string }
  AuthorProfileAuditLog: { username?: string } // In case author is the user themselves
  AuthorProfileOrders: { username?: string } // In case author is the user themselves
  AuthorProfileSettings: { username?: string } // In case author is the user themselves
  Cart: undefined
  OrderList: undefined
  Order: undefined
  OrderItem: undefined
  Checkout: undefined
  CheckoutStatus: undefined
  // Modal
  KitDetailModal: { id: string }
}

const HomeStack = createStackNavigator<HomeStackParamList>()

const HomeStackScreen: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  return (
    <HomeStack.Navigator
      initialRouteName="Default"
      screenOptions={{
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0
        },
        headerLeftContainerStyle: {
          paddingLeft: headerLeftContainerPaddingLeft
        },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
      }}
    >
      <HomeStack.Group>
        <HomeStack.Screen name="Default" component={Default} />
        <HomeStack.Screen name="Search" component={Search} />
        <HomeStack.Screen
          name="AuthorProfileDefault"
          component={AuthorProfileDefault}
        />
        <HomeStack.Screen
          name="AddressList"
          component={AddressList}
          options={{
            title: t('screen.common.address.list.title')
          }}
        />
        <HomeStack.Screen
          name="AddressLocationSearch"
          component={AddressLocationSearch}
          options={{}}
        />
        <HomeStack.Screen
          name="AddressForm"
          component={AddressForm}
          options={{}}
        />
      </HomeStack.Group>
      <HomeStack.Group screenOptions={{ presentation: 'modal' }}>
        <HomeStack.Screen
          name="KitDetailModal"
          component={KitDetailModal}
          options={{
            title: '',
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            headerTransparent: true
          }}
        />
      </HomeStack.Group>
    </HomeStack.Navigator>
  )
}

export default HomeStackScreen
