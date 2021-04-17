import React, { useContext, useState } from 'react'

interface TabBarBadgeCountType {
  notification: number
}

export const TabBarBadgeContext = React.createContext<{
  tabBarBadgeCount: TabBarBadgeCountType
  setTabBarBadgeCount: React.Dispatch<
    React.SetStateAction<TabBarBadgeCountType>
  >
}>({
  tabBarBadgeCount: {
    notification: 0
  },
  setTabBarBadgeCount: () => {
    return
  }
})

export const useTabBarBadgeCount = () => {
  const { tabBarBadgeCount, setTabBarBadgeCount } = useContext(
    TabBarBadgeContext
  )
  return { tabBarBadgeCount, setTabBarBadgeCount }
}

export default ({ children }: any) => {
  const [tabBarBadgeCount, setTabBarBadgeCount] = useState({
    notification: 3
  })

  return (
    <TabBarBadgeContext.Provider
      value={{
        tabBarBadgeCount,
        setTabBarBadgeCount
      }}
    >
      {children}
    </TabBarBadgeContext.Provider>
  )
}
