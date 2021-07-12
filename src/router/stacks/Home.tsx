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
}

export type ModalledHomeStackParamList = {
  Home: undefined
  KitDetailModal: { id: string }
}

const HomeStack = createStackNavigator<HomeStackParamList>()
const ModalledHomeStack = createStackNavigator<ModalledHomeStackParamList>()

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
      <HomeStack.Screen name="Default" component={Default} />
      <HomeStack.Screen name="Search" component={Search} />
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
    </HomeStack.Navigator>
  )
}

const ModalledHomeStackScreen: React.FC = () => {
  return (
    <ModalledHomeStack.Navigator mode="modal">
      <ModalledHomeStack.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          headerShown: false
        }}
      />
      <ModalledHomeStack.Screen
        name="KitDetailModal"
        component={KitDetailModal}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
        }}
      />
    </ModalledHomeStack.Navigator>
  )
}

export default ModalledHomeStackScreen
