import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Default as ProfileDefault } from 'screens/profile'
import { headerLeftContainerPaddingLeft } from 'utils/constants'

type ProfileStackParamList = {
  Default: undefined
  List: undefined
  Item: { id: string }
}

const ProfileStack = createStackNavigator<ProfileStackParamList>()

const ProfileStackScreen = () => (
  <ProfileStack.Navigator
    initialRouteName="Default"
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
    <ProfileStack.Screen name="Default" component={ProfileDefault} />
  </ProfileStack.Navigator>
)

export default ProfileStackScreen
