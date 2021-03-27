import React from 'react'
import { View } from 'react-native'
import { ActivityIndicator, Modal, StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native'

interface OverlayLoaderProps {
  loading: boolean
  type?: 'location'
}

// Find more Lottie files @ https://lottiefiles.com/featured
const OverlayLoader: React.FC<OverlayLoaderProps> = (props) => {
  const { loading, type } = props
  const animationBasePath = 'visuals/lottie'
  let animationFileName = 'default.json'
  if (type === 'location') {
    animationFileName = 'map-marker.json'
  }
  const animationPath = `${animationBasePath}/${animationFileName}`
  return (
    <Modal visible={loading} animationType="none" transparent>
      <View style={styles.modalBackground}>
        <ActivityIndicator size="large" color="blue" />
        <LottieView
          source={require(animationPath)}
          autoPlay
          loop
          style={styles.lottieView}
        />
      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  lottieView: {
    width: 400,
    height: 400
  }
})

export default OverlayLoader
