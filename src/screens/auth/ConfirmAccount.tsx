import React, { useContext, useMemo, useState } from 'react'
import { StyleSheet, Platform, KeyboardAvoidingView, View } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Input, Button, Text } from 'react-native-elements'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { LocalizationContext } from 'contexts/Localization'
import { ScrollView } from 'react-native-gesture-handler'
import { AuthStackParamList } from 'router/stacks/Auth'
import Auth from '@aws-amplify/auth'
import { useInAppMessage } from 'contexts/InAppMessage'

type FormData = {
  verificationCode: string
}

type ConfirmAccountScreenRouteProp = RouteProp<
  AuthStackParamList,
  'ConfirmAccount'
>

const ConfirmAccount: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const { addInAppMessage } = useInAppMessage()
  const route = useRoute<ConfirmAccountScreenRouteProp>()
  const email = useMemo(() => route.params.email, [route])
  const username = useMemo(() => route.params.username, [route])
  const [confirmAccountLoading, setConfirmAccountLoading] = useState(false)

  const formSchema: Yup.SchemaOf<FormData> = Yup.object().shape({
    verificationCode: Yup.string().required(
      t('common.message.validation.required')
    )
  })

  const onSubmit = async ({ verificationCode }: FormData) => {
    try {
      setConfirmAccountLoading(true)
      await Auth.confirmSignUp(username, verificationCode)
      navigation.navigate('SignIn' as keyof AuthStackParamList)
    } catch (err) {
      addInAppMessage({
        message: err.message ?? err,
        type: 'error'
      })
    } finally {
      setConfirmAccountLoading(false)
    }
  }

  const onResendCode = async () => {
    try {
      await Auth.resendSignUp(username)
    } catch (err) {
      addInAppMessage({
        message: err.message ?? err,
        type: 'error'
      })
    }
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
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            touched,
            values,
            errors
          }) => (
            <View>
              <Input
                value={values.verificationCode}
                placeholder={t(
                  'screen.auth.confirmAccount.label.verificationCode'
                )}
                onChangeText={handleChange('verificationCode')}
                onBlur={handleBlur('verificationCode')}
                errorMessage={
                  touched.verificationCode ? errors.verificationCode : undefined
                }
                style={styles.formInput}
                autoCompleteType="password"
                autoCorrect={false}
                secureTextEntry
                textContentType="password"
                returnKeyType="send"
                onSubmitEditing={handleSubmit as any}
              />
              <Button
                title={t(
                  'screen.auth.confirmAccount.button.done'
                ).toLocaleUpperCase()}
                onPress={handleSubmit as any}
                loading={confirmAccountLoading}
                disabled={confirmAccountLoading}
              />
            </View>
          )}
        </Formik>

        <Text style={styles.centeredText}>
          {t('screen.auth.confirmAccount.text.notReceivedCode')}
        </Text>
        <Button
          type="clear"
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
    textAlign: 'center'
  },
  description: {
    paddingVertical: 10,
    textAlign: 'center'
  },
  formInput: {
    flex: 1
  },
  centeredText: {
    paddingTop: 24,
    textAlign: 'center'
  }
})

export default ConfirmAccount
