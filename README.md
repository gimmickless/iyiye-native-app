# iyiye-native-app

[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/)

Native app for iyiye

## Upgrade dependencies

```bash
expo upgrade
```

## Prerequisities

### Local Development

Create an `.env.development.local` file with some content like:

```env
REACT_APP_APPSYNC_GRAPHQL_ENDPOINT=https://{api_id}.appsync-api.{region}.amazonaws.com/graphql
REACT_APP_COGNITO_IDENTITY_POOL_ID={region}:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
REACT_APP_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_COGNITO_USER_POOL_ID={region}_xxxxxxxxx
REACT_APP_S3_USER_STORAGE_BUCKET={USER_STORAGE_BUCKET_NAME}
REACT_APP_S3_SITE_META_BUCKET={SITE_META_BUCKET_NAME}
REACT_APP_GOOGLE_PLACES_API_KEY={GOOGLE_PLACES_API_KEY}
```

### Github actions secrets

Some

- sensitive

- user-specific

information are preferred to be kept in Github secrets.

So, the following should be added to the repo secrets beforehand:

| **Secret Key**                        | **Secret Value**                                              |
| ------------------------------------- | ------------------------------------------------------------- |
| AWS_ACCESS_KEY_ID                     | `{YOUR_AWS_ACCESS_KEY_ID}`                                    |
| AWS_SECRET_ACCESS_KEY                 | `{SECRET_KEY_FOR_THE_ACCESS_KEY}`                             |
| REACT_APP_AWS_REGION                  | `eu-west-1` _or another region_                               |
| REACT_APP_APPSYNC_GRAPHQL_ENDPOINT    | `https://{api_id}.appsync-api.{region}.amazonaws.com/graphql` |
| REACT_APP_COGNITO_IDENTITY_POOL_ID    | `{region}:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`               |
| REACT_APP_COGNITO_USER_POOL_CLIENT_ID | `xxxxxxxxxxxxxxxxxxxxxxxxxx`                                  |
| REACT_APP_COGNITO_USER_POOL_ID        | `{region}_xxxxxxxxx`                                          |
| REACT_APP_S3_USER_STORAGE_BUCKET      | `{USER_STORAGE_BUCKET_NAME}`                                  |
| REACT_APP_S3_SITE_META_BUCKET         | `{SITE_META_BUCKET_NAME}`                                     |
| REACT_APP_GOOGLE_PLACES_API_KEY       | `{GOOGLE_PLACES_API_KEY}`                                     |

### expo start

`expo start` (or `npm start`) starts the app locally.
