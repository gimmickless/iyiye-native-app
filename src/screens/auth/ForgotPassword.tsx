import React, { RefObject, useContext, useRef, useState } from 'react'
import {
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  View,
  NativeModules,
  LayoutAnimation
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Input, Button, Text, Divider, Card } from 'react-native-elements'
import { Formik, FormikProps } from 'formik'
import * as Yup from 'yup'
import {
  forgotPasswordConfirmationCodeRegex,
  passwordRegex,
  usernameMaxLength,
  usernameMinLength,
  usernameRegex
} from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { ScrollView } from 'react-native-gesture-handler'
import { AuthStackScreenNames } from 'types/route'
import Auth from '@aws-amplify/auth'
import { useInAppNotification } from 'contexts/InAppNotification'

type UserInfoFormData = {
  username: string
}

type ResetPasswordFormData = {
  confirmationCode: string
  newPassword: string
  retypeNewPassword: string
}

const { UIManager } = NativeModules

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

const ForgotPasword: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const { addNotification } = useInAppNotification()
  const [sendEmailLoading, setSendEmailLoading] = useState(false)
  const [sendNewPasswordLoading, setSendNewPasswordLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const navigation = useNavigation()
  const formRef = useRef<FormikProps<UserInfoFormData>>(null)
  const newPasswordRef = useRef<typeof Input | null>(null)
  const retypeNewPasswordRef = useRef<typeof Input | null>(null)

  const userInfoSchema: Yup.SchemaOf<UserInfoFormData> = Yup.object().shape({
    username: Yup.string()
      .required(t('common.message.validation.required'))
      .min(usernameMinLength, t('common.message.validation.tooShort'))
      .max(usernameMaxLength, t('common.message.validation.tooLong'))
      .matches(
        usernameRegex,
        t('screen.auth.forgotPassword.message.validation.invalidUsername')
      )
  })

  const resetPasswordSchema: Yup.SchemaOf<ResetPasswordFormData> = Yup.object().shape(
    {
      confirmationCode: Yup.string()
        .required(t('common.message.validation.required'))
        .matches(
          forgotPasswordConfirmationCodeRegex,
          t(
            'screen.auth.forgotPassword.message.validation.invalidConfirmationCode'
          )
        ),
      newPassword: Yup.string()
        .required(t('common.message.validation.required'))
        .matches(
          passwordRegex,
          t('screen.auth.forgotPassword.message.validation.invalidPassword')
        ),
      retypeNewPassword: Yup.string()
        .required(t('common.message.validation.required'))
        .oneOf(
          [Yup.ref('newPassword'), null],
          'screen.auth.forgotPassword.message.validation.passwordsNotMatch'
        )
    }
  )

  const onSubmitEmail = async ({ username }: UserInfoFormData) => {
    setSendEmailLoading(true)
    try {
      await Auth.forgotPassword(username)
      setEmailSent(true)
      LayoutAnimation.easeInEaseOut()
    } catch (err) {
      addNotification({
        message: err.message ?? err,
        type: 'error'
      })
    } finally {
      setSendEmailLoading(false)
    }
  }

  const onSubmitNewPassword = async ({
    confirmationCode,
    newPassword
  }: ResetPasswordFormData) => {
    setSendNewPasswordLoading(true)
    try {
      await Auth.forgotPasswordSubmit(
        formRef.current?.values.username ?? '',
        confirmationCode,
        newPassword
      )
      navigation.navigate(AuthStackScreenNames.SignIn)
    } catch (err) {
      addNotification({
        message: err.message ?? err,
        type: 'error'
      })
    } finally {
      setSendNewPasswordLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text h3 style={styles.title}>
          {t('screen.auth.forgotPassword.text.title')}
        </Text>

        <Formik
          initialValues={{
            username: ''
          }}
          validationSchema={userInfoSchema}
          onSubmit={onSubmitEmail}
          innerRef={formRef}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View style={styles.inputAndButtonRow}>
              <View style={styles.inputAndButtonCol1}>
                <Input
                  value={values.username}
                  placeholder={t('screen.auth.forgotPassword.label.username')}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  errorMessage={errors.username}
                  style={styles.formInput}
                  autoCompleteType="username"
                  autoCorrect={false}
                  keyboardType="visible-password"
                  maxLength={usernameMaxLength}
                  textContentType="username"
                  returnKeyType="send"
                  blurOnSubmit={false}
                  onSubmitEditing={() => handleSubmit as any}
                />
              </View>
              <View style={styles.inputAndButtonCol2}>
                <Button
                  style={styles.formSubmitButton}
                  loading={sendEmailLoading}
                  disabled={sendEmailLoading}
                  title={(!emailSent
                    ? t('screen.auth.forgotPassword.button.sendEmail')
                    : t('screen.auth.forgotPassword.button.resendEmail')
                  ).toLocaleUpperCase()}
                  onPress={handleSubmit as any}
                />
              </View>
            </View>
          )}
        </Formik>

        <Divider style={styles.dividerLine} />

        {emailSent && (
          <Card>
            <Text h4 style={styles.title}>
              {t('screen.auth.forgotPassword.text.checkEmail')}
            </Text>
            <Formik
              initialValues={{
                confirmationCode: '',
                newPassword: '',
                retypeNewPassword: ''
              }}
              validationSchema={resetPasswordSchema}
              onSubmit={onSubmitNewPassword}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                <View>
                  <Input
                    value={values.confirmationCode}
                    placeholder={t(
                      'screen.auth.forgotPassword.label.confirmationCode'
                    )}
                    onChangeText={handleChange('confirmationCode')}
                    onBlur={handleBlur('confirmationCode')}
                    errorMessage={errors.confirmationCode}
                    style={styles.formInput}
                    autoCompleteType="off"
                    autoCorrect={false}
                    keyboardType="visible-password"
                    textContentType="oneTimeCode"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => newPasswordRef.current?.focus()}
                  />
                  <Input
                    value={values.newPassword}
                    ref={newPasswordRef}
                    placeholder={t(
                      'screen.auth.forgotPassword.label.newPassword'
                    )}
                    onChangeText={handleChange('newPassword')}
                    onBlur={handleBlur('newPassword')}
                    errorMessage={errors.newPassword}
                    style={styles.formInput}
                    autoCompleteType="password"
                    autoCorrect={false}
                    secureTextEntry
                    textContentType="newPassword"
                    returnKeyType="send"
                    onSubmitEditing={() =>
                      retypeNewPasswordRef.current?.focus()
                    }
                  />
                  <Input
                    value={values.retypeNewPassword}
                    ref={retypeNewPasswordRef}
                    placeholder={t(
                      'screen.auth.forgotPassword.label.retypeNewPassword'
                    )}
                    onChangeText={handleChange('retypeNewPassword')}
                    onBlur={handleBlur('retypeNewPassword')}
                    errorMessage={errors.retypeNewPassword}
                    style={styles.formInput}
                    autoCompleteType="off"
                    autoCorrect={false}
                    secureTextEntry
                    textContentType="none"
                    returnKeyType="next"
                    onSubmitEditing={handleSubmit as any}
                  />
                  <Button
                    style={styles.formSubmitButton}
                    loading={sendNewPasswordLoading}
                    disabled={sendNewPasswordLoading}
                    title={t(
                      'screen.auth.forgotPassword.button.done'
                    ).toLocaleUpperCase()}
                    onPress={handleSubmit as any}
                  />
                </View>
              )}
            </Formik>
          </Card>
        )}
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
  formInput: {
    flex: 1
  },
  inputAndButtonRow: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  inputAndButtonCol1: {
    flex: 3
  },
  inputAndButtonCol2: {
    flex: 1
  },
  formSubmitButton: {},
  dividerLine: {
    height: 2
  }
})

export default ForgotPasword
