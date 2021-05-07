import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api'

export const GoogleConfig = {
  Places: {
    apiKey: process.env.REACT_APP_GOOGLE_PLACES_API_KEY
  }
}

// AWS
export const AwsConfig = {
  // S3
  Storage: {
    AWSS3: {
      bucket: process.env.REACT_APP_S3_USER_STORAGE_BUCKET,
      region: process.env.REACT_APP_AWS_REGION
    }
  },
  // Cognito
  Auth: {
    mandatorySignIn: false,
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_COGNITO_USER_POOL_CLIENT_ID
  },
  // AppSync
  aws_appsync_graphqlEndpoint: process.env.REACT_APP_APPSYNC_GRAPHQL_ENDPOINT,
  aws_appsync_region: process.env.REACT_APP_AWS_REGION,
  aws_appsync_authenticationType: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
}
