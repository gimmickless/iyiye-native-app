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
  usernameMaxLength,
  usernameMinLength
} from 'utils/constants'
import { LocalizationContext } from 'contexts/Localization'

type FormData = {
  username: string
  password: string
}

const Profile: React.FC = () => {
  const { t } = useContext(LocalizationContext)
  const navigation = useNavigation()

  // Schema valdiation
  const formSchema = Yup.object<FormData>().shape({
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
    console.log(username)
    console.log(password)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Title */}
      <Text h3 style={styles.title}>
        {t('screen.signIn.title')}
      </Text>
      {/* Form Fields */}
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
      {/* Form Actions */}
      <Button
        style={styles.formSubmitButton}
        title={t('screen.signIn.button.done')}
        onPress={handleSubmit(onSubmit)}
      />
      {/* Other Actions */}
      <Button
        type="clear"
        style={styles.navigationButton}
        title={t('screen.signIn.button.forgotPassword')}
        onPress={() => navigation.navigate('ResetPassword')}
      />
      <Button
        type="clear"
        style={styles.navigationButton}
        title={t('screen.signIn.button.signUp')}
        onPress={() => navigation.navigate('SignUp')}
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
    // paddingBottom: 250
    // marginBottom: 250
  },
  title: {
    padding: 10
  },
  formInput: {},
  formSubmitButton: {},
  navigationButton: {}
})

export default Profile
