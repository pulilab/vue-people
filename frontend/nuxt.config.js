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
    gitHubApiKey: process.env.GITHUB_KEY || '',
    gitHubClientId: process.env.GITHUB_CLIENT_ID || '',
    gitHubClientSecret: process.env.GITHUB_SECRET || '',
  },
  plugins: [
    { src: '~plugins/axios.js', ssr: true },
    { src: '~plugins/vuetify.js', ssr: true },
    { src: '~plugins/vee-validate.js', ssr: true },
    { src: '~plugins/vue-leaflet.js', ssr: false },
    { src: '~plugins/vuex-geolocation.js', ssr: false },
    { src: '~plugins/store-tokens.js', ssr: false }
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  proxy: {},
  axios: {
    baseURL: 'http://django:8000/',
    browserBaseURL: 'https://localhost/',
    credentials: true
  },
  router: {
    middleware: 'auth'
  },
  loading: { color: '#3B8070' },
  build: {
    extractCSS: true,
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
    proxy: true,
    credentials: true
  };
  config.proxy = {
    '/api/': { target: 'https://localhost/', secure: false },
    '/accounts/': { target: 'http://localhost/' }
  };
}

module.exports = config;
