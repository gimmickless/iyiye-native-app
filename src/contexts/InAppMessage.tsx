import React, { useContext, useState } from 'react'
import { InAppMessageType } from 'types/context'

export const InAppMessageContext = React.createContext<{
  inAppMessage: InAppMessageType | undefined
  addInAppMessage: (input: InAppMessageType) => void
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
  const { inAppMessage, addInAppMessage, removeInAppMessage } =
    useContext(InAppMessageContext)
  return { inAppMessage, addInAppMessage, removeInAppMessage }
}

export default ({ children }: any) => {
  const [inAppMessage, setInAppMessage] = useState<
    InAppMessageType | undefined
  >(undefined)

  const addInAppMessage = (input: InAppMessageType) => setInAppMessage(input)
  const removeInAppMessage = () => setInAppMessage(undefined)

  return (
    <InAppMessageContext.Provider
      value={{
        inAppMessage,
        addInAppMessage,
        removeInAppMessage
      }}
    >
      {children}
    </InAppMessageContext.Provider>
  )
}
