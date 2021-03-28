import React from 'react'
import { View } from 'react-native'
import { Modal, StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native'

interface OverlayLoaderProps {
  loading: boolean
  type?: 'location'
}

// Find more Lottie files @ https://lottiefiles.com/featured
const OverlayLoader: React.FC<OverlayLoaderProps> = (props) => {
  const { loading, type } = props
  let animationSource
  if (type === 'location') {
    animationSource = require('visuals/lottie/map-marker.json')
  } else {
    animationSource = require('visuals/lottie/default.json')
  }

  return (
    <Modal visible={loading} animationType="none" transparent>
      <View style={styles.modalBackground}>
        {/* <ActivityIndicator size="large" color="blue" /> */}
        <LottieView
          source={animationSource}
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
