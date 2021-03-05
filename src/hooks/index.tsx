import { useContext } from 'react'
import { InAppNotificationContext } from 'contexts/InAppNotification'
import { AuthUserContext } from 'contexts/Auth'

export const useInAppNotification = () => {
  const { notification, addNotification, removeNotification } = useContext(
    InAppNotificationContext
  )
  return { notification, addNotification, removeNotification }
}

export const useAuthUser = () => {
  const { state: authUser } = useContext(AuthUserContext)
  return { authUser }
}
