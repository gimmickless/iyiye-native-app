import React, { useContext, useRef, useState } from 'react'
import {
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Pressable,
  Modal,
  View,
  TextInput
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Localization from 'expo-localization'
import {
  Input,
  Button,
  Text,
  CheckBox,
  ThemeContext
} from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  emailMaxLength,
  emailMinLength,
  emailRegex,
  getHyperlinkTextColor,
  passwordRegex,
  usernameMaxLength,
  usernameMinLength,
  usernameRegex
} from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { ScrollView } from 'react-native-gesture-handler'
import { getMaxDateFor18OrMoreYearsOld } from 'utils/validations'
import Auth from '@aws-amplify/auth'
import { useColorScheme } from 'react-native-appearance'
import { convertDateToIsoString } from 'utils/conversions'
import { useInAppMessage } from 'contexts/InAppMessage'
import { AuthStackParamList } from 'router/stacks/Auth'

type FormData = {
  fullName: string
  username: string
  email: string
  password: string
  retypePassword: string
  birthDate?: Date
  termsAgreed?: boolean
}

const SignUp: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const scheme = useColorScheme()
  const { theme: rneTheme } = useContext(ThemeContext)
  const { addInAppMessage } = useInAppMessage()
  const [signUpLoading, setSignUpLoading] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  const usernameRef = useRef<TextInput | null>(null)
  const emailRef = useRef<TextInput | null>(null)
  const passwordRef = useRef<TextInput | null>(null)
  const retypePasswordRef = useRef<TextInput | null>(null)
  const birthDateRef = useRef<TextInput | null>(null)

  const maxBirthDate = getMaxDateFor18OrMoreYearsOld()

  // Schema validation
  const formSchema: Yup.SchemaOf<FormData> = Yup.object().shape({
    fullName: Yup.string().required(t('common.message.validation.required')),
    username: Yup.string()
      .required(t('common.message.validation.required'))
      .min(
        Math.min(emailMinLength, usernameMinLength),
        t('common.message.validation.tooShort')
      )
      .max(
        Math.max(emailMaxLength, usernameMaxLength),
        t('common.message.validation.tooLong')
      )
      .matches(
        usernameRegex,
        t('screen.auth.signUp.message.validation.invalidUsername')
      ),
    email: Yup.string()
      .required(t('common.message.validation.required'))
      .min(emailMinLength, t('common.message.validation.tooShort'))
      .max(emailMaxLength, t('common.message.validation.tooLong'))
      .matches(
        emailRegex,
        t('screen.auth.signUp.message.validation.invalidEmail')
      ),
    password: Yup.string()
      .required(t('common.message.validation.required'))
      .matches(
        passwordRegex,
        t('screen.auth.signUp.message.validation.invalidPassword')
      ),
    retypePassword: Yup.string()
      .required(t('common.message.validation.required'))
      .oneOf(
        [Yup.ref('password'), null],
        t('screen.auth.signUp.message.validation.passwordsNotMatch')
      ),
    birthDate: Yup.date()
      .required(t('common.message.validation.required'))
      .max(maxBirthDate, t('screen.auth.signUp.message.validation.tooYoung')),
    termsAgreed: Yup.boolean().oneOf(
      [true],
      t('common.message.validation.mustCheck')
    )
  })

  const onSubmit = async ({
    fullName,
    username,
    email,
    password,
    birthDate
  }: FormData) => {
    setSignUpLoading(true)
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          name: fullName,
          email: email,
          birthdate: convertDateToIsoString(birthDate),
          locale: Localization.locale,
          'custom:theme': scheme,
          'custom:contactable': 'true'
        }
      })
      navigation.navigate('ConfirmAccount' as keyof AuthStackParamList, {
        email,
        username
      })
    } catch (err) {
      addInAppMessage({
        message: err.message ?? err,
        type: 'error'
      })
    } finally {
      setSignUpLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text h3 style={styles.title}>
          {t('screen.auth.signUp.text.title')}
        </Text>
        <Formik
          initialValues={{
            fullName: '',
            username: '',
            email: '',
            password: '',
            retypePassword: '',
            birthDate: undefined,
            termsAgreed: false
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
            errors,
            setFieldValue
          }) => (
            <View>
              <Input
                value={values.fullName}
                placeholder={t('screen.auth.signUp.label.fullName')}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                errorMessage={touched.fullName ? errors.fullName : undefined}
                style={styles.formInput}
                autoCompleteType="name"
                autoCorrect={false}
                keyboardType="visible-password"
                textContentType="name"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => usernameRef.current?.focus()}
              />
              <Input
                value={values.username}
                ref={usernameRef}
                placeholder={t('screen.auth.signUp.label.username')}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                errorMessage={touched.username ? errors.username : undefined}
                style={styles.formInput}
                autoCompleteType="username"
                autoCorrect={false}
                keyboardType="visible-password"
                maxLength={usernameMaxLength}
                textContentType="username"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => emailRef.current?.focus()}
              />
              <Input
                value={values.email}
                ref={emailRef}
                placeholder={t('screen.auth.signUp.label.email')}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                errorMessage={touched.email ? errors.email : undefined}
                style={styles.formInput}
                autoCompleteType="email"
                autoCorrect={false}
                keyboardType="email-address"
                maxLength={emailMaxLength}
                textContentType="emailAddress"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              <Input
                value={values.password}
                placeholder={t('screen.auth.signUp.label.password')}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                errorMessage={touched.password ? errors.password : undefined}
                style={styles.formInput}
                autoCompleteType="password"
                autoCorrect={false}
                secureTextEntry
                textContentType="newPassword"
                passwordRules="minlength: 8; required: lower; required: upper; required: digit;"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => retypePasswordRef.current?.focus()}
              />
              <Input
                value={values.retypePassword}
                placeholder={t('screen.auth.signUp.label.retypePassword')}
                onChangeText={handleChange('retypePassword')}
                onBlur={handleBlur('retypePassword')}
                errorMessage={
                  touched.retypePassword ? errors.retypePassword : undefined
                }
                style={styles.formInput}
                autoCompleteType="off"
                autoCorrect={false}
                secureTextEntry
                textContentType="none"
                returnKeyType="next"
                onSubmitEditing={() => birthDateRef.current?.focus()}
              />
              <Pressable onPress={() => setShowDatePicker(true)}>
                <View pointerEvents="none">
                  <Input
                    editable={false}
                    value={convertDateToIsoString(values.birthDate)}
                    ref={birthDateRef}
                    placeholder={t('screen.auth.signUp.label.birthDate')}
                    onFocus={() => setShowDatePicker(true)}
                    onChangeText={handleChange('birthDate')}
                    onBlur={handleBlur('birthDate')}
                    errorMessage={
                      touched.birthDate ? errors.birthDate : undefined
                    }
                    style={styles.formInput}
                    autoCompleteType="off"
                    autoCorrect={false}
                    textContentType="none"
                    showSoftInputOnFocus={false}
                  />
                </View>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={values.birthDate ?? new Date()}
                  mode="date"
                  display="default"
                  onChange={(_: any, date: any) => {
                    setShowDatePicker(false)
                    setFieldValue('birthDate', date)
                  }}
                  maximumDate={new Date()}
                />
              )}
              <CheckBox
                checked={values.termsAgreed}
                title={
                  <View style={styles.checkboxText}>
                    <Text>
                      {t('screen.auth.signUp.label.termsAgreed.start')}&nbsp;
                    </Text>
                    <Pressable onPress={() => setShowTermsModal(true)}>
                      <Text
                        style={{
                          color: getHyperlinkTextColor(scheme === 'dark')
                        }}
                      >
                        {t('screen.auth.signUp.label.termsAgreed.terms')}
                        &nbsp;🡥
                      </Text>
                    </Pressable>
                    <Text>
                      &nbsp;{t('screen.auth.signUp.label.termsAgreed.middle')}
                      &nbsp;
                    </Text>
                    <Pressable onPress={() => setShowPrivacyModal(true)}>
                      <Text>
                        {t('screen.auth.signUp.label.termsAgreed.privacy')}
                      </Text>
                    </Pressable>
                    <Text>
                      &nbsp;{t('screen.auth.signUp.label.termsAgreed.end')}
                    </Text>
                  </View>
                }
                onPress={() =>
                  setFieldValue('termsAgreed', !values.termsAgreed)
                }
                onBlur={handleBlur('termsAgreed')}
                uncheckedColor={rneTheme.colors?.error}
                containerStyle={styles.formCheckbox}
              />
              {touched.termsAgreed && errors.termsAgreed && (
                <Text
                  style={{
                    ...styles.errorMessageText,
                    color: rneTheme.colors?.error
                  }}
                >
                  {errors.termsAgreed}
                </Text>
              )}
              <Button
                title={t('screen.auth.signUp.button.done').toLocaleUpperCase()}
                loading={signUpLoading}
                disabled={signUpLoading}
                onPress={handleSubmit as any}
              />
            </View>
          )}
        </Formik>

        <Text style={styles.centeredText}>{`${t(
          'screen.auth.signUp.text.alreadyHavingAccount'
        )} `}</Text>
        <Button
          type="clear"
          title={t('screen.auth.signUp.button.signIn')}
          onPress={() =>
            navigation.navigate('SignIn' as keyof AuthStackParamList)
          }
        />

        <Modal
          visible={showTermsModal}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <View style={styles.modalContainerView}>
            <ScrollView>
              <Text h3 style={styles.modalTitle}>
                {t('screen.auth.signUp.text.termsModalTitle')}
              </Text>
              <Text>Terms of Service text here</Text>
            </ScrollView>
            <Button
              title={t('common.button.ok')}
              onPress={() => setShowTermsModal(false)}
            />
          </View>
        </Modal>
        <Modal
          visible={showPrivacyModal}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <View style={styles.modalContainerView}>
            <ScrollView>
              <Text h3 style={styles.modalTitle}>
                {t('screen.auth.signUp.text.privacyModalTitle')}
              </Text>
              <Text>Privacy policy text here</Text>
            </ScrollView>
            <Button
              title={t('common.button.ok')}
              onPress={() => setShowPrivacyModal(false)}
            />
          </View>
        </Modal>
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
  modalTitle: {
    paddingVertical: 10
  },
  formInput: {
    flex: 1
  },
  formCheckbox: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  checkboxText: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  errorMessageText: {
    fontSize: 12,
    marginLeft: 16
  },
  centeredText: {
    paddingTop: 24,
    textAlign: 'center'
  },
  modalContainerView: {
    flex: 1
  }
})

export default SignUp
