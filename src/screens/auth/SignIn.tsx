import React, { useContext, useRef, useState } from 'react'
import {
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  View,
  TextInput
} from 'react-native'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { Input, Button, Text } from 'react-native-elements'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  emailMaxLength,
  emailMinLength,
  usernameMaxLength,
  usernameMinLength
} from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { ScrollView } from 'react-native-gesture-handler'
import { AuthUserContext } from 'contexts/Auth'
import { useInAppMessage } from 'contexts/InAppMessage'
import { AuthStackParamList } from 'router/stacks/Auth'

type FormData = {
  usernameOrEmail: string
  password: string
}

const SignIn: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const { addInAppMessage } = useInAppMessage()
  const { action } = useContext(AuthUserContext)
  const [signInLoading, setSignInLoading] = useState(false)
  const navigation = useNavigation()
  const passwordRef = useRef<TextInput | null>(null)

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
      ),
    password: Yup.string().required(t('common.message.validation.required'))
  })

  const onSubmit = async ({ usernameOrEmail, password }: FormData) => {
    setSignInLoading(true)
    try {
      await action.login({ usernameOrEmail, password })
      navigation.dispatch(CommonActions.goBack()) // Return to previous screen
    } catch (err) {
      addInAppMessage({
        message: err.message ?? err,
        type: 'error'
      })
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
                value={values.usernameOrEmail}
                placeholder={t('screen.auth.signIn.label.usernameOrEmail')}
                onChangeText={handleChange('usernameOrEmail')}
                onBlur={handleBlur('usernameOrEmail')}
                errorMessage={
                  touched.usernameOrEmail ? errors.usernameOrEmail : undefined
                }
                style={styles.formInput}
                autoCompleteType="email"
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
                    errorMessage={
                      touched.password ? errors.password : undefined
                    }
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
                  title={t('screen.auth.signIn.button.forgotPassword')}
                  onPress={() =>
                    navigation.navigate(
                      'ForgotPassword' as keyof AuthStackParamList
                    )
                  }
                />
              </View>
              <Button
                loading={signInLoading}
                disabled={signInLoading}
                title={t('screen.auth.signIn.button.done').toLocaleUpperCase()}
                onPress={handleSubmit as any}
              />
            </View>
          )}
        </Formik>

        <Text style={styles.centeredText}>
          {`${t('screen.auth.signIn.text.notHavingAccount')}`}&nbsp;
        </Text>
        <Button
          type="clear"
          title={t('screen.auth.signIn.button.signUp')}
          onPress={() =>
            navigation.navigate('SignUp' as keyof AuthStackParamList)
          }
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
  title: {
    paddingVertical: 10,
    textAlign: 'center'
  },
  formInput: {
    flex: 1
  },
  passwordInputView: {
    flex: 1
  },
  centeredText: {
    paddingTop: 24,
    textAlign: 'center'
  }
})

export default SignIn
