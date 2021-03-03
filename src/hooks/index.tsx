import { useContext } from 'react'
import { InAppNotificationContext } from 'contexts/InAppNotification'

export const useInAppNotification = () => {
  const { notification, addNotification, removeNotification } = useContext(
    InAppNotificationContext
  )
  return { notification, addNotification, removeNotification }
}
