import React, { useContext } from 'react'
import { StyleSheet, Platform, KeyboardAvoidingView, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Input, Button, Text } from 'react-native-elements'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import {
  emailMaxLength,
  emailMinLength,
  usernameMaxLength,
  usernameMinLength
} from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'
import { ScrollView } from 'react-native-gesture-handler'

type FormData = {
  username: string
  email: string
  password: string
  retypePassword: string
}

const SignUp: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()

  // Schema valdiation
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
        t('screen.signUp.message.validation.invalidUserName')
      ),
    password: Yup.string().required(t('common.message.validation.required'))
  })
  const { control, handleSubmit, errors } = useForm<FormData>({
    resolver: yupResolver(formSchema)
  })

  const onSubmit = ({ username, password }: FormData) => {
    console.log(username)
    console.log(password)
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
                  placeholder={t('screen.signIn.label.password')}
                  onChangeText={(v) => onChange(v)}
                  onBlur={onBlur}
                  errorMessage={errors.password?.message}
                  style={styles.formInput}
                  autoCompleteType="password"
                  autoCorrect={false}
                  secureTextEntry
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
