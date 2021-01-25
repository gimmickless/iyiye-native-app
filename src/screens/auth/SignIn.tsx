import React, { useContext, useRef, useState } from 'react'
import { StyleSheet, Platform, KeyboardAvoidingView, View } from 'react-native'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { Input, Button, Text } from 'react-native-elements'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  emailMaxLength,
  emailMinLength,
  textColor,
  usernameMaxLength,
  usernameMinLength,
  usernameOrEmailRegex
} from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { ScrollView } from 'react-native-gesture-handler'
import { useToast } from 'react-native-styled-toast'
import { AuthUserContext } from 'contexts/Auth'
import { AuthStackScreenNames, TabNames } from 'types/route'

type FormData = {
  usernameOrEmail: string
  password: string
}

const SignIn: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const { action } = useContext(AuthUserContext)
  const [signInLoading, setSignInLoading] = useState(false)
  const { toast } = useToast()
  const navigation = useNavigation()
  const passwordRef = useRef<Input>(null)

  const formSchema: Yup.SchemaOf<FormData> = Yup.object().shape({
    usernameOrEmail: Yup.string()
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
        usernameOrEmailRegex,
        t('screen.auth.signIn.message.validation.invalidUsernameOrEmail')
      ),
    password: Yup.string().required(t('common.message.validation.required'))
  })

  const onSubmit = async ({ usernameOrEmail, password }: FormData) => {
    setSignInLoading(true)
    try {
      console.log('pressed')
      await action.login({ usernameOrEmail, password })
      navigation.dispatch(CommonActions.goBack()) // Return to previous screen
    } catch (err) {
      toast({ message: err.message ?? err, intent: 'ERROR', duration: 0 })
    } finally {
      setSignInLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text h3 style={styles.title}>
          {t('screen.auth.signIn.text.title')}
        </Text>
        <Formik
          initialValues={{
            usernameOrEmail: '',
            password: ''
          }}
          validationSchema={formSchema}
          onSubmit={onSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View>
              <Input
                value={values.usernameOrEmail}
                placeholder={t('screen.auth.signIn.label.usernameOrEmail')}
                onChangeText={handleChange('usernameOrEmail')}
                onBlur={handleBlur('usernameOrEmail')}
                errorMessage={errors.usernameOrEmail}
                style={styles.formInput}
                autoCompleteType="username"
                autoCorrect={false}
                keyboardType="visible-password"
                maxLength={Math.max(emailMaxLength, usernameMaxLength)}
                textContentType="emailAddress"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              <View style={styles.passwordArea}>
                <View style={styles.passwordInputView}>
                  <Input
                    value={values.password}
                    ref={passwordRef}
                    placeholder={t('screen.auth.signIn.label.password')}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    errorMessage={errors.password}
                    style={styles.formInput}
                    autoCompleteType="password"
                    autoCorrect={false}
                    secureTextEntry
                    textContentType="password"
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit as any}
                  />
                </View>
                <Button
                  type="clear"
                  style={styles.passwordInlineButton}
                  title={t('screen.auth.signIn.button.forgotPassword')}
                  onPress={() =>
                    navigation.navigate(AuthStackScreenNames.ForgotPassword)
                  }
                />
              </View>
              <Button
                style={styles.formSubmitButton}
                loading={signInLoading}
                disabled={signInLoading}
                title={t('screen.auth.signIn.button.done').toLocaleUpperCase()}
                onPress={handleSubmit as any}
              />
              {/* TODO: Following added for test. Remove before Prod */}
              <Button
                style={styles.formSubmitButton}
                title="To Home"
                onPress={() => navigation.navigate(TabNames.Home)}
              />
            </View>
          )}
        </Formik>

        <Text style={styles.centeredText}>
          {`${t('screen.auth.signIn.text.notHavingAccount')}`}&nbsp;
        </Text>
        <Button
          type="clear"
          style={styles.secondaryButton}
          title={t('screen.auth.signIn.button.signUp')}
          onPress={() => navigation.navigate(AuthStackScreenNames.SignUp)}
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
  passwordArea: {
    justifyContent: 'space-between',
    flexDirection: 'row'
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
    color: textColor.screenBody.title
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
  secondaryButton: {}
})

export default SignIn
