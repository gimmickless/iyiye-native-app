import { LocalizationContext } from 'contexts/Localization'
import { useInAppNotification } from 'hooks'
import React, { useContext } from 'react'
import { Alert, Platform, ToastAndroid } from 'react-native'
import { InAppNotificationType } from 'types/context'

const Toast = ({
  visible,
  message,
  type,
  dismissButtonText,
  dismiss
}: {
  visible: boolean
  message: string | undefined
  type: InAppNotificationType['type'] | undefined
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

const InAppNotificationBox: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const { notification, removeNotification } = useInAppNotification()

  return (
    <Toast
      visible={!!notification}
      message={notification?.message}
      type={notification?.type}
      dismissButtonText={t('common.button.ok')}
      dismiss={removeNotification}
    />
  )
}

export default InAppNotificationBox
