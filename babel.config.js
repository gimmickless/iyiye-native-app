module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo', '@babel/preset-typescript'],
    env: {
      production: {
        plugins: ['inline-dotenv']
      },
      development: {
        plugins: [
          [
            'inline-dotenv',
            {
              path: '.env.development.local'
            }
          ]
        ]
      }
    },
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            tests: ['./tests/'],
            '@components': './src/components'
          }
        }
      ]
    ]
  }
}
