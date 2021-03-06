import { DefaultTheme, DarkTheme, Theme } from '@react-navigation/native'

export const IyiyeNavigationLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors
  }
}

export const IyiyeNavigationDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors
  }
}
