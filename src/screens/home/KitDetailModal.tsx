import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useContext, useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, ThemeContext } from 'react-native-elements'
import { ModalledHomeStackParamList } from 'router/stacks/Home'

type KitDetailModalProps = RouteProp<
  ModalledHomeStackParamList,
  'KitDetailModal'
>

const KitDetailModal: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<KitDetailModalProps>()
  const { theme: rneTheme } = useContext(ThemeContext)
  const id = route.params.id
  return (
    <View style={styles.container}>
      <Text style={{ color: rneTheme.colors?.black }}>
        This is a modal of id: {id}
      </Text>
      <Button onPress={() => navigation.goBack()} title="Dismiss" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default KitDetailModal
