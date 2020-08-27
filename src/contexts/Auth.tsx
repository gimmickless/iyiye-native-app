import React, { useState } from 'react'

interface AuthUserContextDataType {}

export interface AuthUserContextType {
  user: AuthUserContextDataType | null
  setUser: Function
}

export const AuthUserContext = React.createContext<AuthUserContextType>({
  user: null,
  setUser: () => {}
})

export default ({ children }: any) => {
  const [user, setUser] = useState<AuthUserContextDataType | null>(null)
  return (
    <AuthUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthUserContext.Provider>
  )
}
