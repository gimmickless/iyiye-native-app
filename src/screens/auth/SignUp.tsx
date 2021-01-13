import React, { useContext } from 'react'
import { StyleSheet, Platform, KeyboardAvoidingView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Input, Button, Text } from 'react-native-elements'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import {
  emailMaxLength,
  emailMinLength,
  emailRegex,
  usernameMaxLength,
  usernameMinLength
} from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { ScrollView } from 'react-native-gesture-handler'

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

  // Schema valdiation
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
        /^[A-Z0-9]+$/i,
        t('screen.signUp.message.validation.invalidUserName')
      ),
    email: Yup.string()
      .required(t('common.message.validation.required'))
      .min(emailMinLength, t('common.message.validation.tooShort'))
      .max(emailMaxLength, t('common.message.validation.tooLong'))
      .matches(emailRegex, t('screen.signUp.message.validation.invalidEmail')),
    password: Yup.string().required(t('common.message.validation.required')),
    retypePassword: Yup.string()
      .required(t('common.message.validation.required'))
      .oneOf(
        [Yup.ref('password'), null],
        'screen.signUp.message.validation.passwordsNotMatch'
      ),
    birthDate: Yup.date().required(t('common.message.validation.required')),
    termsAgreed: Yup.boolean().oneOf(
      [true],
      t('common.message.validation.mustCheck')
    )
  })
  const { control, handleSubmit, errors } = useForm<FormData>({
    resolver: yupResolver(formSchema)
  })

  const onSubmit = ({
    fullName,
    username,
    email,
    password,
    birthDate
  }: FormData) => {
    console.log(fullName)
    console.log(username)
    console.log(email)
    console.log(password)
    console.log(birthDate)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView>
        <Text h3 style={styles.title}>
          {t('screen.signUp.text.title')}
        </Text>
        <Controller
          name="fullName"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ onChange, onBlur, value }) => (
            <Input
              value={value}
              placeholder={t('screen.signUp.label.fullName')}
              onChangeText={(v) => onChange(v)}
              onBlur={onBlur}
              errorMessage={errors.fullName?.message}
              style={styles.formInput}
              autoCompleteType="name"
              autoCorrect={false}
              keyboardType="visible-password"
              textContentType="name"
            />
          )}
        />
        <Controller
          name="username"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ onChange, onBlur, value }) => (
            <Input
              value={value}
              placeholder={t('screen.signUp.label.username')}
              onChangeText={(v) => onChange(v)}
              onBlur={onBlur}
              errorMessage={errors.username?.message}
              style={styles.formInput}
              autoCompleteType="username"
              autoCorrect={false}
              keyboardType="visible-password"
              maxLength={usernameMaxLength}
              textContentType="username"
            />
          )}
        />
        <Controller
          name="email"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ onChange, onBlur, value }) => (
            <Input
              value={value}
              placeholder={t('screen.signUp.label.email')}
              onChangeText={(v) => onChange(v)}
              onBlur={onBlur}
              errorMessage={errors.email?.message}
              style={styles.formInput}
              autoCompleteType="email"
              autoCorrect={false}
              keyboardType="email-address"
              maxLength={emailMaxLength}
              textContentType="emailAddress"
            />
          )}
        />
        <Controller
          name="password"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ onChange, onBlur, value }) => (
            <Input
              value={value}
              placeholder={t('screen.signUp.label.password')}
              onChangeText={(v) => onChange(v)}
              onBlur={onBlur}
              errorMessage={errors.password?.message}
              style={styles.formInput}
              autoCompleteType="password"
              autoCorrect={false}
              secureTextEntry
              textContentType="newPassword"
              passwordRules="minlength: 20; required: lower; required: upper; required: digit;"
            />
          )}
        />
        <Controller
          name="retypePassword"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ onChange, onBlur, value }) => (
            <Input
              value={value}
              placeholder={t('screen.signUp.label.retypePassword')}
              onChangeText={(v) => onChange(v)}
              onBlur={onBlur}
              errorMessage={errors.retypePassword?.message}
              style={styles.formInput}
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry
              textContentType="none"
            />
          )}
        />
        <Button
          style={styles.formSubmitButton}
          title={t('screen.signUp.button.done')}
          onPress={handleSubmit(onSubmit)}
        />

        <Text style={styles.centeredText}>{`${t(
          'screen.signUp.text.alreadyHavingAccount'
        )} `}</Text>
        <Button
          type="clear"
          style={styles.navigationButton}
          title={t('screen.signUp.button.signIn')}
          onPress={() => navigation.navigate('SignIn')}
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
  signUpArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  title: {
    paddingVertical: 10,
    textAlign: 'center',
    color: 'dimgrey'
  },
  formInput: {
    flex: 1
  },
  passwordInputView: {
    flex: 1
  },
  passwordInlineButton: {},
  formSubmitButton: {},
  centeredText: {
    paddingTop: 24,
    textAlign: 'center'
  },
  navigationButton: {}
})

export default SignUp
