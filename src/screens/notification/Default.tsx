import React, { useContext } from 'react'
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native'
import { Text, ThemeContext } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import Checkbox from 'react-native-bouncy-checkbox'
import ListSeparator from 'components/shared/ListSeparator'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LocalizationContext } from 'contexts/Localization'

const getNotificationItemIconName = (type?: string) => {
  if (!type) return 'map-marker-question'
  switch (type) {
    case 'announcement':
      return 'bullhorn'
    case 'promotion':
      return 'sale'
    case 'report':
      return 'file-document'
    case 'comment':
      return 'comment'
    case 'star':
      return 'star'
    case 'flag':
      return 'flag'
    default:
      return 'alien'
  }
}

const Default: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const { theme: rneTheme } = useContext(ThemeContext)

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.listContainer}
        data={notifications}
        renderItem={({ item }) => {
          return (
            <View style={styles.listItem}>
              <View style={styles.listItemTypeIconField}>
                <MaterialCommunityIcons
                  name={getNotificationItemIconName(item.value?.type)}
                  size={25}
                  color={rneTheme.colors?.grey2}
                />
              </View>
              <View style={styles.listItemMainField}>
                <Text>{item.value?.routeAddress}</Text>
              </View>
            </View>
          )
        }}
        keyExtractor={(item) => item.key}
        ItemSeparatorComponent={ListSeparator}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  listContainer: { paddingHorizontal: 8 },
  listItem: {
    flex: 1,
    flexDirection: 'row'
  },
  listItemTypeIconField: {
    flex: 1,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItemMainField: {
    flex: 7
  }
})

export default Default
