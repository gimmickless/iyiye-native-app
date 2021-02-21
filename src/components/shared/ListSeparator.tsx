import React from 'react'
import { StyleSheet, View } from 'react-native'

const ListSeparator = () => <View style={styles.listItemSeparator} />

const styles = StyleSheet.create({
  listContainer: { paddingHorizontal: 8 },
  listItemSeparator: {
    flex: 1,
    height: 1,
    backgroundColor: 'grey'
  }
})

export default ListSeparator
