const englishTranslation = {
  common: {
    button: {
      ok: 'OK',
      accept: 'Accept'
    },
    message: {
      validation: {
        required: 'This field is required',
        tooShort: 'Too short',
        tooLong: 'Too long',
        mustCheck: 'This field must be checked'
      }
    }
  },
  screen: {
    signIn: {
      title: 'Sign In',
      label: {
        usernameOrEmail: 'Username (or Email)',
        password: 'Password'
      },
      text: {
        title: 'Welcome back!',
        notHavingAccount: 'Not having an account?'
      },
      button: {
        done: 'Login',
        forgotPassword: 'Forgot?',
        signUp: 'Register Now'
      },
      message: {
        validation: {
          invalidUserNameOrEmail: 'Invalid username or email'
        }
      }
    },
    signUp: {
      title: 'Sign Up',
      label: {
        fullName: 'Full Name',
        username: 'Username',
        email: 'Email',
        password: 'Password',
        retypePassword: 'Retype Password',
        birthDate: 'Birth Date',
        termsAgreed: {
          start: 'I have read and accept',
          terms: 'Terms of Service',
          middle: 'and',
          privacy: 'Privacy Policy',
          end: ''
        }
      },
      text: {
        title: 'Create Account',
        alreadyHavingAccount: 'Already having an account?',
        termsModalTitle: 'Terms of Service',
        privacyModalTitle: 'Privacy Policy'
      },
      button: {
        done: 'Register',
        signIn: 'Sign In'
      },
      message: {
        validation: {
          invalidUserName: 'Invalid username',
          invalidEmail: 'Invalid email address',
          passwordsNotMatch: 'Passwords do not match',
          tooYoung: 'Not old enough'
        }
      }
    },
    signOut: {
      title: 'Sign Out'
    },
    confirmAccount: {
      title: 'Confirm Account',
      label: {
        verificationCode: 'Verification Code'
      },
      text: {
        title: 'Email Verification',
        subtitle: "A verification code is sent to '{{email}}'",
        notReceivedCode: 'Not received any damn?'
      },
      button: {
        done: 'Done',
        resend: 'Send Again'
      }
    },
    resetPassword: {
      title: 'Reset Password',
      label: {}
    },
    recipeKits: {
      title: 'Recipe Kits',
      label: {}
    },
    notifications: {
      title: 'Notifications',
      label: {}
    },
    favorites: {
      title: 'Favorites'
    },
    cart: {
      title: 'Cart',
      summary: {
        title: 'Cart'
      },
      checkout: {
        title: 'Checkout'
      }
    },
    profile: {
      title: 'Profile',
      label: {}
    },
    settings: {
      title: 'Settings',
      label: {}
    }
  }
}

export default englishTranslation
