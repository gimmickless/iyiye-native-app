const englishTranslation = {
  common: {
    button: {
      ok: 'OK',
      accept: 'Accept',
      edit: 'Edit',
      delete: 'Delete',
      cancel: 'Cancel'
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
    auth: {
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
            invalidUsernameOrEmail: 'Invalid username or email'
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
            invalidUsername: 'Invalid username',
            invalidEmail: 'Invalid email address',
            invalidPassword: 'Invalid password',
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
      forgotPassword: {
        title: 'Forgot Password',
        text: {
          title: 'People forget',
          checkEmail: 'Check your emails for the code'
        },
        label: {
          username: 'Username',
          confirmationCode: 'Confirmation Code',
          newPassword: 'New Password',
          retypeNewPassword: 'Retype New Password'
        },
        button: {
          sendEmail: 'Send ',
          resendEmail: 'Resend',
          done: 'Change'
        },
        message: {
          validation: {
            invalidUsername: 'Invalid username',
            invalidPassword: 'Invalid password',
            invalidConfirmationCode: 'Invalid confirmation code',
            passwordsNotMatch: 'Passwords do not match'
          }
        }
      }
    },
    home: {
      default: {
        title: {
          auth: 'Hi {{username}}',
          unauth: 'Hi there'
        },
        subtitle: {
          auth: 'What are we cooking today?',
          unauth: 'What are we cooking today?'
        },
        button: {
          location: {
            label: 'Address',
            current: 'Current'
          }
        },
        alert: {
          loginToAddAddress: {
            title: 'Login Now',
            message:
              'Authentication required for adding addresses and editing them',
            button: {
              ok: 'Go to Login'
            }
          }
        }
      },
      addresses: {
        title: 'Addresses',
        button: {
          create: 'Add New'
        },
        message: {
          locationPermissionDenied: 'Permission to access location was denied'
        },
        list: {
          currentLocation: {
            title: 'Current Location'
          }
        },
        kind: {
          current: 'Current',
          home: 'Home',
          office: 'Office',
          other: 'Other'
        }
      }
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
