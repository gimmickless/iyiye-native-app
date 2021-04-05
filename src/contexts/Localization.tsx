import React, { useState } from 'react'
import i18n, { Scope, TranslateOptions } from 'i18n-js'
import * as Localization from 'expo-localization'

export const LocalizationContext = React.createContext<{
  t: (scope: Scope, options?: TranslateOptions) => string
  locale: string
  setLocale: React.Dispatch<React.SetStateAction<string>>
}>({
  t: () => '',
  locale: '',
  setLocale: () => null
})

export default ({ children }: any) => {
  const [locale, setLocale] = useState(Localization.locale)

  return (
    <LocalizationContext.Provider
      value={{
        t: (scope, options) => i18n.t(scope, { locale, ...options }),
        locale,
        setLocale
      }}
    >
      {children}
    </LocalizationContext.Provider>
  )
}
