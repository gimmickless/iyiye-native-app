import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import resources from 'locales'

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  debug: true,

  interpolation: {
    escapeValue: false // not needed for react as it escapes by default
  }
})

export default i18n
