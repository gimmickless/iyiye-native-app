import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Default as ProfileDefault } from 'screens/profile'
import { headerLeftContainerPaddingLeft } from 'utils/constants'
import { ProfileStackScreenNames } from 'types/route'
import { LocalizationContext } from 'contexts/Localization'

export type ProfileStackParamList = {
  ProfileDefault: { username?: string }
  ProfileList: undefined
  ProfileItem: { id: string }
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
    </ProfileStack.Navigator>
  )
}

export default ProfileStackScreen
