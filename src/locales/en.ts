const englishTranslation = {
  common: {
    button: {
      ok: 'OK',
      accept: 'Accept',
      edit: 'Edit',
      delete: 'Delete',
      cancel: 'Cancel',
      save: 'Save'
    },
    message: {
      validation: {
        required: 'This field is required',
        tooShort: 'Too short',
        tooLong: 'Too long',
        mustCheck: 'This field must be checked'
      },
      notFound: 'Not Found'
    }
  },
  component: {
    auth: {
      guestNotAllowed: {
        message: 'Please log in to your account to see the content',
        button: {
          goToLogin: 'Go to Login'
        }
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
    common: {
      address: {
        list: {
          title: 'Addresses',
          button: {
            create: 'Add New',
            createFirstAddress: "Let's create your first address"
          },
          message: {
            locationPermissionDenied:
              'Permission to access location was denied',
            nothingFound: 'No addresses here'
          },
          list: {
            currentLocation: {
              title: 'Current Location'
            },
            subtitle: {
              streetNumber: 'StreetNumber',
              floor: 'Floor'
            }
          },
          kind: {
            current: 'Current',
            home: 'Home',
            office: 'Office',
            other: 'Other'
          },
          alert: {
            maxAddressLimit: {
              title: 'Max Address Limit Hit',
              message: 'Please edit one of the addresses or delete to make room'
            }
          }
        },
        locationSearch: {
          titleSearchTextInput: {
            placeholder: 'Search...'
          },
          quickAccessSectionList: {
            currLocationItem: 'Use Current Location',
            listTitle: {
              recents: 'Recent'
            },
            button: {
              clearHistory: 'Clear All'
            }
          }
        },
        form: {
          title: {
            new: 'New Address',
            edit: 'Edit {{addressKey}}',
            addressKeys: {
              address1: 'Address 1',
              address2: 'Address 2',
              address3: 'Address 3',
              address4: 'Address 4',
              address5: 'Address 5'
            },
            section: {
              fineTuning: 'Fine Tuning'
            }
          },
          label: {
            addressLine: 'Address',
            fineTuning: {
              streetNumber: 'Street Num',
              flatNumber: 'Flat Num',
              floor: 'Floor'
            },
            addressDirections: 'Directions'
          },
          segmentedControl: {
            addressType: {
              home: 'Home',
              office: 'Office',
              other: 'Other'
            }
          },
          button: {
            updateWithThisLocation: 'Update Address with Pinned Location'
          },
          message: {
            streetNumberCannotBeEmpty: 'Street number cannot be empty'
          },
          alert: {
            addressSlotFull: {
              title: 'Address Slot Full',
              message:
                'Cannot add more than {{maxAddressCount}} addresses. Please delete a record from list, or edit an existing one',
              button: {
                backToList: 'Back to List'
              }
            }
          }
        }
      },
      profile: {
        title: 'Profile',
        label: {},
        default: {
          list: {
            orders: 'Orders',
            kits: 'Recipe Kits',
            addresses: 'Addresses',
            auditLog: 'Audit Log'
          },
          alert: {
            mediaLibraryPermissionNotGranted: {
              message:
                'Sorry, we need camera roll permissions to change the profile picture'
            }
          }
        },
        settings: {
          title: 'Settings',
          label: {},
          sectionList: {
            default: {
              title: '',
              items: {
                signOut: ''
              }
            }
          },
          alert: {
            signOutConfirmation: {
              title: 'About to Sign Out',
              message: 'Are you sure?',
              okButton: 'Yes, I am'
            }
          }
        },
        orders: {
          title: 'Orders'
        },
        kits: {
          title: 'Kits'
        },
        auditLog: {
          title: 'Audit Log'
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
        kitCategory: {
          title: 'Categories',
          item: {
            burger: 'Burger',
            chicken: 'Chicken',
            glutenFree: 'Gluten Free',
            halal: 'Halal',
            jhatka: 'Jhatka',
            kosher: 'Kosher',
            nutFree: 'Nut Free',
            raw: 'Raw',
            seaFood: 'Sea Food',
            thai: 'Thai',
            vegan: 'Vegan',
            vegetarian: 'Vegetarian'
          }
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
      }
    },
    cart: {
      default: {
        title: 'Cart'
      }
    },
    recipeKits: {
      title: 'Recipe Kits',
      label: {}
    },
    notifications: {
      default: {
        title: 'Notifications',
        label: {}
      }
    },
    favorites: {
      title: 'Favorites'
    }
  }
}

export default englishTranslation
