import React, { useContext } from 'react'
import { StyleSheet, Platform, KeyboardAvoidingView, View } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { Input, Button, Text } from 'react-native-elements'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { textColor } from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { ScrollView } from 'react-native-gesture-handler'
import { AuthStackParamList } from 'router/stacks/Auth'

type FormData = {
  verificationCode: string
}

type ConfirmAccountScreenRouteProp = RouteProp<
  AuthStackParamList,
  'ConfirmAccount'
>

const ConfirmAccount: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const route = useRoute<ConfirmAccountScreenRouteProp>()
  const email = route.params.email

  const formSchema: Yup.SchemaOf<FormData> = Yup.object().shape({
    verificationCode: Yup.string().required(
      t('common.message.validation.required')
    )
  })

  const onSubmit = ({ verificationCode }: FormData) => {
    console.log('pressed')
    console.log(email)
    console.log(verificationCode)
    // TODO: Amplify Sign In + Navigate to Home
  }

  const onResendCode = () => {
    console.log('Resend code')
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text h3 style={styles.title}>
          {t('screen.auth.confirmAccount.text.title')}
        </Text>
        <Text h4 style={styles.description}>
          {t('screen.auth.confirmAccount.text.subtitle', { email })}
        </Text>
        <Formik
          initialValues={{
            verificationCode: ''
          }}
          validationSchema={formSchema}
          onSubmit={onSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View>
              <Input
                value={values.verificationCode}
                placeholder={t(
                  'screen.auth.confirmAccount.label.verificationCode'
                )}
                onChangeText={handleChange('verificationCode')}
                onBlur={handleBlur('verificationCode')}
                errorMessage={errors.verificationCode}
                style={styles.formInput}
                autoCompleteType="password"
                autoCorrect={false}
                secureTextEntry
                textContentType="password"
                returnKeyType="send"
                onSubmitEditing={handleSubmit as any}
              />
              <Button
                style={styles.formSubmitButton}
                title={t(
                  'screen.auth.confirmAccount.button.done'
                ).toLocaleUpperCase()}
                onPress={handleSubmit as any}
              />
            </View>
          )}
        </Formik>

        <Text style={styles.centeredText}>{`${t(
          'screen.auth.confirmAccount.text.notReceivedCode'
        )} `}</Text>
        <Button
          type="clear"
          style={styles.secondaryButton}
          title={t('screen.auth.confirmAccount.button.resend')}
          onPress={onResendCode}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  title: {
    paddingVertical: 10,
    textAlign: 'center',
    color: textColor.screenBody.title
  },
  description: {
    paddingVertical: 10,
    textAlign: 'center',
    color: textColor.screenBody.subtitle
  },
  formInput: {
    flex: 1
  },
  formSubmitButton: {},
  centeredText: {
    paddingTop: 24,
    textAlign: 'center'
  },
  secondaryButton: {}
})

export default ConfirmAccount
