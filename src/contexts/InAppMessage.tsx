import React, { useContext, useState } from 'react'
import { InAppMessageType } from 'types/context'

export const InAppMessageContext = React.createContext<{
  inAppMessage: InAppMessageType | undefined
  addInAppMessage: React.Dispatch<
    React.SetStateAction<InAppMessageType | undefined>
  >
  removeInAppMessage: () => void
}>({
  inAppMessage: undefined,
  addInAppMessage: () => {
    return
  },
  removeInAppMessage: () => {
    return
  }
})

export const useInAppMessage = () => {
  const { inAppMessage, addInAppMessage, removeInAppMessage } = useContext(
    InAppMessageContext
  )
  return { inAppMessage, addInAppMessage, removeInAppMessage }
}

export default ({ children }: any) => {
  const [inAppMessage, setInAppMessage] = useState<
    InAppMessageType | undefined
  >(undefined)

  return (
    <InAppMessageContext.Provider
      value={{
        inAppMessage,
        addInAppMessage: setInAppMessage,
        removeInAppMessage: () => setInAppMessage(undefined)
      }}
    >
      {children}
    </InAppMessageContext.Provider>
  )
}
