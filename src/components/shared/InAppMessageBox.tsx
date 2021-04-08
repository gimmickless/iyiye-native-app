import { useInAppMessage } from 'contexts/InAppMessage'
import { LocalizationContext } from 'contexts/Localization'
import React, { useContext } from 'react'
import { Alert, Platform, ToastAndroid } from 'react-native'
import { InAppMessageType } from 'types/context'

const Toast = ({
  visible,
  message,
  type,
  dismissButtonText,
  dismiss
}: {
  visible: boolean
  message: string | undefined
  type: InAppMessageType['type'] | undefined
  dismissButtonText: string
  dismiss: () => void
}) => {
  if (visible) {
    if (Platform.OS === 'ios') {
      Alert.alert(
        type?.toUpperCase() ?? '',
        message,
        [
          {
            text: dismissButtonText,
            onPress: () => dismiss(),
            style: 'cancel'
          }
        ],
        { cancelable: true }
      )
    } else {
      ToastAndroid.showWithGravityAndOffset(
        `${type?.toUpperCase()}: ${message}`,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      )
      dismiss()
    }
    return null
  }
  return null
}

const InAppMessageBox: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const { inAppMessage, removeInAppMessage } = useInAppMessage()

  return (
    <Toast
      visible={!!inAppMessage}
      message={inAppMessage?.message}
      type={inAppMessage?.type}
      dismissButtonText={t('common.button.ok')}
      dismiss={removeInAppMessage}
    />
  )
}

export default InAppMessageBox
