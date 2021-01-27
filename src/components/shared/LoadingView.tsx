import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

const LoadingView: React.FC = () => {
  return (
    <View style={styles.loadingView}>
      <ActivityIndicator />
    </View>
  )
}

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: 'center'
  }
})

export default LoadingView
