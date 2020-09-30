import React from 'react'
import { StyleSheet, Platform, KeyboardAvoidingView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Input, Button, Text } from 'react-native-elements'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers'
import * as Yup from 'yup'
import {
  emailMaxLength,
  emailMinLength,
  usernameMaxLength,
  usernameMinLength
} from 'utils/constants'

type FormData = {
  username: string
  password: string
}

const Profile: React.FC = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  // const [username, setUsername] = useState('')
  // const [password, setPassword] = useState('')
  console.log(navigation)

  // Schema valdiation
  const formSchema = Yup.object<FormData>().shape({
    username: Yup.string()
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
      )
      .required(t('common.message.validation.required')),
    password: Yup.string().required(t('common.message.validation.required'))
  })
  const { control, handleSubmit, errors } = useForm<FormData>({
    resolver: yupResolver(formSchema)
  })

  const onSubmit = (data: FormData) => console.log(data)

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Title */}
      <Text h3 style={styles.title}>
        {t('screen.signIn.title')}
      </Text>
      {/* Form */}
      <Controller
        name="username"
        defaultValue=""
        control={control}
        rules={{ required: true }}
        render={({ onChange, onBlur, value }) => (
          <Input
            style={styles.formInput}
            placeholder={t('screen.signIn.label.usernameOrEmail')}
            // value={username}
            // onChangeText={setUsername}
            onBlur={onBlur}
            onChangeText={(v) => onChange(v)}
            value={value}
            errorMessage={errors.username?.message}
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
            style={styles.formInput}
            placeholder={t('screen.signIn.label.password')}
            // value={password}
            // onChangeText={setPassword}
            onBlur={onBlur}
            onChangeText={(v) => onChange(v)}
            value={value}
            errorMessage={errors.password?.message}
          />
        )}
      />
      {/* Actions */}
      <Button
        style={styles.formDoneButton}
        title={t('screen.signIn.button.done')}
        onPress={handleSubmit(onSubmit)}
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
  formDoneButton: {}
})

export default Profile
