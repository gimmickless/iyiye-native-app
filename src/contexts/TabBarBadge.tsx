import React, { useState } from 'react'

interface TabCountType {
  notification: number
}

export const TabBarBadgeContext = React.createContext<{
  tabCount: TabCountType
  setTabCount: React.Dispatch<React.SetStateAction<TabCountType>>
}>({
  tabCount: {
    notification: 0
  },
  setTabCount: () => {
    return
  }
})

export default ({ children }: any) => {
  const [tabCount, setTabCount] = useState({
    notification: 3
  })

  return (
    <TabBarBadgeContext.Provider
      value={{
        tabCount,
        setTabCount
      }}
    >
      {children}
    </TabBarBadgeContext.Provider>
  )
}
