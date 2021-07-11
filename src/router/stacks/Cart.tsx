import React, { useContext } from 'react'
import {
  CardStyleInterpolators,
  createStackNavigator
} from '@react-navigation/stack'
import { Default as CartDefault } from 'screens/cart'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'

export type CartStackParamList = {
  Default: undefined
}

const CartStack = createStackNavigator<CartStackParamList>()

const CartStackScreen: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  return (
    <CartStack.Navigator
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
      <CartStack.Screen
        name="Default"
        component={CartDefault}
        options={{
          title: t('screen.cart.default.title')
        }}
      />
    </CartStack.Navigator>
  )
}

export default CartStackScreen
