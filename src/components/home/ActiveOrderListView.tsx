import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { defaultHomeScrollViewTopMargin } from 'utils/constants'

interface ActiveOrderListViewProps {
  username: string
}

const ActiveOrderListView: React.FC<ActiveOrderListViewProps> = (props) => {
  const { username } = props
  return (
    <View style={styles.container}>
      <Text>{username}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: defaultHomeScrollViewTopMargin
  },
  scrollContainer: {
    flexDirection: 'row'
  }
})

export default ActiveOrderListView
