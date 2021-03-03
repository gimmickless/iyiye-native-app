import React, { useState } from 'react'
import { InAppNotificationType } from 'types/context'

export const InAppNotificationContext = React.createContext<{
  notification: InAppNotificationType | undefined
  addNotification: React.Dispatch<
    React.SetStateAction<InAppNotificationType | undefined>
  >
  removeNotification: () => void
}>({
  notification: undefined,
  addNotification: () => {},
  removeNotification: () => {}
})

export default ({ children }: any) => {
  const [notification, setNotification] = useState<
    InAppNotificationType | undefined
  >(undefined)

  return (
    <InAppNotificationContext.Provider
      value={{
        notification,
        addNotification: setNotification,
        removeNotification: () => setNotification(undefined)
      }}
    >
      {children}
    </InAppNotificationContext.Provider>
  )
}
