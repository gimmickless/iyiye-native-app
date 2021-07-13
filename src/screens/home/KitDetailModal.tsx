import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { LocalizationContext } from 'contexts/Localization'
import React, { useContext, useLayoutEffect, useMemo, useState } from 'react'
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { Button, ThemeContext } from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ModalledHomeStackParamList } from 'router/stacks/Home'
import InputSpinner from 'react-native-input-spinner'
import { maxKitCountPerCart } from 'utils/constants'
import { useEffect } from 'react'

type KitDetailModalProps = RouteProp<
  ModalledHomeStackParamList,
  'KitDetailModal'
>

const KitDetailModal: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<KitDetailModalProps>()
  const { t } = useContext(LocalizationContext)
  const { theme: rneTheme } = useContext(ThemeContext)
  const [count, setCount] = useState(0)
  const id = route.params.id

  // TODO: Get details from AppSync call
  const isKitInUserCart = false
  const kit = {}

  // Customize header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Kit Name Here',
      headerRight: () => (
        <Button
          type="clear"
          icon={
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={15}
              color={rneTheme.colors?.primary}
            />
          }
          onPress={() => navigation.goBack()}
        />
      )
    })
  }, [navigation, rneTheme.colors?.primary])

  return (
    <View style={styles.container}>
      {/* Scroll View */}
      <ScrollView style={styles.scroll}>
        <Text style={{ color: rneTheme.colors?.black }}>
          This is a modal of id: {id}
        </Text>
      </ScrollView>
      {/* Actions */}
      <View
        style={[styles.action, { backgroundColor: rneTheme.colors?.grey5 }]}
      >
        <Text>€ XX.YY</Text>
        {isKitInUserCart ? (
          <React.Fragment>
            <InputSpinner
              max={maxKitCountPerCart}
              min={1}
              colorMax={'red'}
              value={count}
              onChange={(num: number) => {
                setCount(num)
              }}
            />
            <Button
              type="outline"
              title={t('screen.home.kitDetailModal.button.removeFromCart')}
              icon={
                <MaterialCommunityIcons
                  name="cart-off"
                  size={15}
                  color={rneTheme.colors?.primary}
                />
              }
            />
          </React.Fragment>
        ) : (
          <Button
            type="solid"
            title={t('screen.home.kitDetailModal.button.addToCart')}
            icon={
              <MaterialCommunityIcons
                name="cart"
                size={15}
                color={rneTheme.colors?.white}
              />
            }
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scroll: {},
  action: {
    width: '90%',
    borderRadius: 12,
    flexDirection: 'row'
  }
})

export default KitDetailModal
