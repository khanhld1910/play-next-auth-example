/* eslint-disable @typescript-eslint/no-var-requires */
const config = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true
}

const withTM = require('next-transpile-modules')([
  '@next-auth/firebase-adapter'
])

module.exports = withTM(config)
