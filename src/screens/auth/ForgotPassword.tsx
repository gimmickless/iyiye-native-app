import React, { useContext, useRef, useState } from 'react'
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
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  forgotPasswordConfirmationCodeRegex,
  passwordRegex,
  textColor,
  usernameMaxLength,
  usernameMinLength,
  usernameRegex
} from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { ScrollView } from 'react-native-gesture-handler'
import { useToast } from 'react-native-styled-toast'

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
  const [sendEmailLoading, setSendEmailLoading] = useState(false)
  const [sendNewPasswordLoading, setSendNewPasswordLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { toast } = useToast()
  const navigation = useNavigation()
  const newPasswordRef = useRef<Input>(null)
  const retypeNewPasswordRef = useRef<Input>(null)

  const userInfoSchema: Yup.SchemaOf<UserInfoFormData> = Yup.object().shape({
    username: Yup.string()
      .required(t('common.message.validation.required'))
      .min(usernameMinLength, t('common.message.validation.tooShort'))
      .max(usernameMaxLength, t('common.message.validation.tooLong'))
      .matches(
        usernameRegex,
        t('screen.forgotPassword.message.validation.invalidUsername')
      )
  })

  const resetPasswordSchema: Yup.SchemaOf<ResetPasswordFormData> = Yup.object().shape(
    {
      confirmationCode: Yup.string()
        .required(t('common.message.validation.required'))
        .matches(
          forgotPasswordConfirmationCodeRegex,
          t('screen.forgotPassword.message.validation.invalidConfirmationCode')
        ),
      newPassword: Yup.string()
        .required(t('common.message.validation.required'))
        .matches(
          passwordRegex,
          t('screen.forgotPassword.message.validation.invalidPassword')
        ),
      retypeNewPassword: Yup.string()
        .required(t('common.message.validation.required'))
        .oneOf(
          [Yup.ref('newPassword'), null],
          'screen.forgotPassword.message.validation.passwordsNotMatch'
        )
    }
  )

  const onSubmitEmail = ({ username }: UserInfoFormData) => {
    setSendEmailLoading(true)
    try {
      console.log('pressed')
      console.log(username)
      // TODO: Amplify ForgotPassword
      setEmailSent(true)
      LayoutAnimation.easeInEaseOut()
    } catch (err) {
      toast({ message: err.message ?? err, intent: 'ERROR', duration: 0 })
    } finally {
      setSendEmailLoading(false)
    }
  }

  const onSubmitNewPassword = ({
    confirmationCode,
    newPassword
  }: ResetPasswordFormData) => {
    setSendNewPasswordLoading(true)
    try {
      console.log('pressed')
      console.log(confirmationCode)
      console.log(newPassword)
      navigation.navigate('SignIn')
      // TODO: Amplify ForgotPasswordSubmit
    } catch (err) {
      toast({ message: err.message ?? err, intent: 'ERROR', duration: 0 })
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
          {t('screen.forgotPassword.text.title')}
        </Text>

        <Formik
          initialValues={{
            username: ''
          }}
          validationSchema={userInfoSchema}
          onSubmit={onSubmitEmail}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View style={styles.inputAndButtonRow}>
              <View style={styles.inputAndButtonCol1}>
                <Input
                  value={values.username}
                  placeholder={t('screen.forgotPassword.label.username')}
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
                    ? t('screen.forgotPassword.button.sendEmail')
                    : t('screen.forgotPassword.button.resendEmail')
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
              {t('screen.forgotPassword.text.checkEmail')}
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
                      'screen.forgotPassword.label.confirmationCode'
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
                    placeholder={t('screen.forgotPassword.label.newPassword')}
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
                      'screen.forgotPassword.label.retypeNewPassword'
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
                      'screen.forgotPassword.button.done'
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
    textAlign: 'center',
    color: textColor.screenBody.title
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
