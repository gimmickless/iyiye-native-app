import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Default as ProfileDefault } from 'screens/profile'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { ProfileStackScreenNames } from 'types/route'
import { Scope, TranslateOptions } from 'i18n-js'

type ProfileStackParamList = {
  ProfileDefault: undefined
  ProfileList: undefined
  ProfileItem: { id: string }
}

const ProfileStack = createStackNavigator<ProfileStackParamList>()

const ProfileStackScreen = (
  t: (scope: Scope, options?: TranslateOptions) => string
) => (
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
        title: undefined
      }}
    />
  </ProfileStack.Navigator>
)

export default ProfileStackScreen
