import { LocalizationContext } from 'contexts/Localization'
import React, { useContext } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { Text, ThemeContext } from 'react-native-elements'

interface NotFoundViewProps {
  message?: string
}

const NotFoundView: React.FC<NotFoundViewProps> = (props) => {
  const { t } = useContext(LocalizationContext)
  const { theme: rneTheme } = useContext(ThemeContext)
  return (
    <View style={styles.nothingFoundContainer}>
      <Image source={require('visuals/notfound.png')} />
      <Text
        h4
        style={{ ...styles.nothingFoundText, color: rneTheme.colors?.grey1 }}
      >
        {props.message ?? t('common.message.notFound')}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  nothingFoundContainer: {
    flex: 1,
    marginVertical: 192,
    marginHorizontal: 36,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  nothingFoundText: {
    marginBottom: 10
  }
})

export default NotFoundView
