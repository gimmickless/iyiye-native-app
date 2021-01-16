import React, { useContext, useRef } from 'react'
import { StyleSheet, Platform, KeyboardAvoidingView, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Input, Button, Text } from 'react-native-elements'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import {
  emailMaxLength,
  emailMinLength,
  textColor,
  usernameMaxLength,
  usernameMinLength
} from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { ScrollView } from 'react-native-gesture-handler'

type FormData = {
  username: string
  password: string
}

const SignIn: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()
  const passwordRef = useRef<Input>(null)

  const formSchema: Yup.SchemaOf<FormData> = Yup.object().shape({
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
        t('screen.signIn.message.validation.invalidUserNameOrEmail')
      ),
    password: Yup.string().required(t('common.message.validation.required'))
  })
  const { control, handleSubmit, errors } = useForm<FormData>({
    resolver: yupResolver(formSchema)
  })

  const onSubmit = ({ username, password }: FormData) => {
    console.log('pressed')
    console.log(username)
    console.log(password)
    // TODO: Amplify Sign In + Navigate to Home
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView>
        <Text h3 style={styles.title}>
          {t('screen.signIn.text.title')}
        </Text>
        <View>
          <Controller
            name="username"
            defaultValue=""
            control={control}
            rules={{ required: true }}
            render={({ onChange, onBlur, value }) => (
              <Input
                value={value}
                placeholder={t('screen.signIn.label.usernameOrEmail')}
                onChangeText={(v) => onChange(v)}
                onBlur={onBlur}
                errorMessage={errors.username?.message}
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
            )}
          />
          <View style={styles.passwordArea}>
            <View style={styles.passwordInputView}>
              <Controller
                name="password"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ onChange, onBlur, value }) => (
                  <Input
                    value={value}
                    ref={passwordRef}
                    placeholder={t('screen.signIn.label.password')}
                    onChangeText={(v) => onChange(v)}
                    onBlur={onBlur}
                    errorMessage={errors.password?.message}
                    style={styles.formInput}
                    autoCompleteType="password"
                    autoCorrect={false}
                    secureTextEntry
                    textContentType="password"
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                )}
              />
            </View>
            <Button
              type="clear"
              style={styles.passwordInlineButton}
              title={t('screen.signIn.button.forgotPassword')}
              onPress={() => navigation.navigate('ResetPassword')}
            />
          </View>
          <Button
            style={styles.formSubmitButton}
            title={t('screen.signIn.button.done')}
            onPress={handleSubmit(onSubmit)}
          />
        </View>

        <Text style={styles.centeredText}>{`${t(
          'screen.signIn.text.notHavingAccount'
        )} `}</Text>
        <Button
          type="clear"
          style={styles.navigationButton}
          title={t('screen.signIn.button.signUp')}
          onPress={() => navigation.navigate('SignUp')}
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
  navigationButton: {}
})

export default SignIn
