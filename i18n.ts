import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { Platform, NativeModules } from 'react-native'
import resources from 'locales'

// The result is like en_US
const deviceLanguageWithCountry: string =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
    : NativeModules.I18nManager.localeIdentifier

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguageWithCountry.substring(0, 2),
  fallbackLng: 'en',
  debug: true,

  interpolation: {
    escapeValue: false // not needed for react as it escapes by default
  }
})

export default i18n
