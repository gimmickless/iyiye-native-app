import React, { useContext, useLayoutEffect } from 'react'
import { View, StyleSheet, ActivityIndicator, Pressable } from 'react-native'
import { Button, Text } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { AuthUserContext } from 'contexts/Auth'
import { homeHeaderHeight, textColor } from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { ScrollView } from 'react-native-gesture-handler'
import { MaterialIcons } from '@expo/vector-icons'
import { HomeStackScreenNames } from 'types/route'

const Default: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const { state: authUser } = useContext(AuthUserContext)
  // Customize header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { height: homeHeaderHeight, elevation: 0, shadowOpacity: 0 },
      headerTitle: () => {
        const isAuthUser = authUser.props ?? undefined
        return (
          <View style={styles.headerTitleContainer}>
            <Text h3 style={styles.headerTitlePrimaryText}>
              {isAuthUser
                ? t('screen.home.default.title.auth', {
                    username: authUser.props?.username
                  })
                : t('screen.home.default.title.unauth')}
              &nbsp;👋
            </Text>
            <Text style={styles.headerTitleSecondaryText}>
              {isAuthUser
                ? t('screen.home.default.subtitle.auth')
                : t('screen.home.default.subtitle.unauth')}
            </Text>
          </View>
        )
      },
      headerRight: () => (
        <Pressable
          onPress={() => {
            navigation.navigate(HomeStackScreenNames.Addresses)
          }}
          style={styles.headerRightAddressButton}
        >
          <View style={styles.headerRightAddressButtonInnerContainer}>
            <Text style={styles.headerRightAddressButtonLabelText}>
              {t('screen.home.default.button.location.label')}
            </Text>
            <MaterialIcons
              name="my-location"
              size={32}
              color={textColor.header.title}
            />
            <Text style={styles.headerRightAddressButtonText}>
              {t('screen.home.default.button.location.current')}
            </Text>
          </View>
        </Pressable>
      )
    })
  }, [authUser, navigation, t])

  return !authUser.loaded ? (
    <View style={styles.loadingView}>
      <ActivityIndicator />
    </View>
  ) : (
    <ScrollView style={styles.view}>
      <Button title="To Login" onPress={() => navigation.navigate('SignIn')} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  loadingView: {
    flex: 1,
    justifyContent: 'center'
  },
  headerTitleContainer: {
    flex: 1,
    height: 64,
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'center'
  },
  headerTitlePrimaryText: {
    color: textColor.header.title,
    alignContent: 'center'
  },
  headerTitleSecondaryText: {
    color: textColor.header.subtitle
  },
  headerRightAddressButtonLabelText: {
    fontSize: 11,
    color: textColor.header.title
  },
  headerRightAddressButtonText: {
    color: textColor.header.title
  },
  headerRightAddressButton: {
    height: 64,
    backgroundColor: 'ghostwhite',
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 16,
    marginRight: 8,
    paddingHorizontal: 8,
    marginVertical: 8
  },
  headerRightAddressButtonInnerContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
})

export default Default
