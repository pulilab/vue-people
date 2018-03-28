const result = require('dotenv').config();

if (result.error) {
  console.log('\x1b[31m%s\x1b[0m','Missing .env file, follow the README instructions');
  throw result.error;
}

const config = {
  head: {
    title: 'vue-people',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'vue people' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },
  css: [
    '~/assets/style/vuetify.styl',
    '~/assets/style/main.less'
  ],
  env: {
    gitHubApiKey: process.env.GITHUB_KEY || ''
  },
  plugins: [
    { src: '~plugins/vuetify.js', ssr: true },
    { src: '~plugins/vee-validate.js', ssr: false },
    { src: '~plugins/vue-leaflet.js', ssr: false },
    { src: '~plugins/vuex-geolocation.js', ssr: false }
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  proxy: {},
  axios: {},
  apollo: {
    clientConfigs: {
      default: '~/apollo/client-configs/default.js'
    }
  },
  loading: { color: '#3B8070' },
  build: {
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    }
  }
};


if (process.env.NODE_ENV !== 'production') {
  config.axios = {
    proxy: true
  };
  config.proxy = {
    '/api/': { target: 'http://0.0.0.0:8000' }
  };
}

module.exports = config;
